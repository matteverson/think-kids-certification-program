'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var emailSender = require('../../components/emails');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var mongoose = require('mongoose');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';

  User.find({name: newUser.name}, function(err, users) {
    if(users.length === 0) {
      newUser.save(function(err, user) {
      if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token, id: user._id });
      });
    } else {
      res.status(401).send('User already exists');
    }
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    var updated = _.extend(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(user);
    });
  });
};

exports.newMessage = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    req.body.messages[req.body.messages.length-1]._id = mongoose.Types.ObjectId();
    var updated = _.extend(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(user);
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Request a password reset
 */
exports.requestPasswordReset = function(req, res, next) {
  var email = String(req.body.email);
  var sender = emailSender('http://' + req.headers.host + '/api/users/reset_token/');
  User.findOne({email: email}).exec()
  .then(function (user) {
    if (!user) throw Error("No user found");
    return user.setToken();
  })
  .then(function (user) {
    return sender.passwordReset(user);
  })
  .then(function (user) {
      res.status(200).send('OK');
      // res.status(500).send('Email not sent: ' + err);
  },
  function (err) {
    res.status(404).send('Not found');
  });
};

/**
 * Reset the password with a token rather than the old password
 */
exports.resetPassword = function(req, res, next) {
  var token = String(req.body.token);
  var email = String(req.body.email);
  var newPassword = String(req.body.newPassword);

  User.getByToken(token, {email: email})
  .then(function (user) {
    if (!user) throw Error("No user found");
    user.password = newPassword;
    return user.resetToken();
  })
  .then(function (user) {
    res.json(user);
  },
  function (err) {
    res.status(401).send('Unauthorized');
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.status(500).send(err);
}
