'use strict';

var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var schedule = require('node-schedule');

// Send email with token
module.exports = function(uri) {
  if (process.env.NODE_ENV !== 'test' && (api_key === null || domain === null)) {
    console.log('Missing MAILGUN_API_KEY or MAILGUN_DOMAIN');
  }

  return {
    passwordReset: function(user) {
      var promise = new Promise(function (resolve, reject) {
        var data = {
          from: 'Think:Kids Certification Program <password-robot@samples.mailgun.org>',
          to: user.email,
          subject: 'Think:Kids Password Reset',
          text: 'To reset your password please visit ' + uri + user.token
        };

        // Skip sending emails from unit test runs
        if (process.env.NODE_ENV !== 'test') {
          mailgun.messages().send(data)
          .then(function (body) {
            resolve(true);
          },
          function (err) {
            console.log(err);
            reject(err);
          });
        }
        else {
          resolve(true);
        }
      });

      return promise;
    },
    sendNotif: function(user, recieveDate) {
      var promise = new Promise(function (resolve, reject) {
        var data = {
          from: 'Think:Kids Certification Program <password-robot@samples.mailgun.org>',
          to: user.email,
          subject: 'Think:Kids New Announcement',
          text: 'There has been a new announcement! Please visit ' + uri + ' to read it.'
        };

        // Skip sending emails from unit test runs
        if (process.env.NODE_ENV !== 'test') {
          var j = schedule.scheduleJob(recieveDate, function(){
            mailgun.messages().send(data)
            .then(function (body) {
              resolve(true);
            },
            function (err) {
              console.log(err);
              reject(err);
            });
          });
        }
        else {
          resolve(true);
        }
      });

      return promise;
    }
  };
};
