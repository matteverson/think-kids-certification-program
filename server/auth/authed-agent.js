/**
* adapted from code by chiyuk
* https://github.com/DaftMonk/generator-angular-fullstack/issues/494#issuecomment-62564718
*/
'use strict';

var app = require('../app');
var User = require('../api/user/user.model');
var request = require('supertest');
var Q = require('q');

// used to generate unique email addresses
var userCounter = 0;

function Authed(role) {
  var agent = request.agent(app);
  var deferred = Q.defer();
  var token;

  var userData = {
    name: 'John Testuser',
    email: (userCounter++) +'@testuser.com',
    password: 'password',
    role: role
  };

  function createUser(done) {
    var user = new User(userData);
    user.save(function(err) {
      if (err) return done(err);
      return done();
    });
  }

  function deleteUser(done) {
    User.remove({email: userData.email}, function(err) {
      if (err) return done(err);
      done();
    });
  };

  function getToken(done) {
    agent
    .post('/auth/local')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      token = res.body.token;
      deferred.resolve();
      done();
    });
    return deferred.promise;
  }

  return {
    authorize: function() {
      before(function(done) {
        createUser(done);
      });
      before(function(done) {
        getToken(done).then(function() {
          done();
        });
      })
    },
    getData: function() {
      var deferred = Q.defer();
      User.findOne({
        email: userData.email
      })
      .exec(function(err, user) {
        deferred.resolve(user);
      });
      return deferred.promise;
    },
    deleteUser: function(done) {
      return deleteUser(done);
    },
    token: function() {
      return token;
    },
    get: function(url) {
      return agent.get(url).set('authorization', 'Bearer ' + token);
    },
    post: function(url) {
      return agent.post(url).set('authorization', 'Bearer ' + token);
    },
    put: function(url) {
      return agent.put(url).set('authorization', 'Bearer ' + token);
    },
    delete: function(url) {
      return agent.delete(url).set('authorization', 'Bearer ' + token);
    }
  }
}

module.exports = function(role) {
  return new Authed(role);
}
