'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

// create two users with different permissions
var admin = require('../../auth/authed-agent')('admin');
var user = require('../../auth/authed-agent')('user');

describe('API: /api/users', function() {

  // log our users in
  admin.authorize();
  user.authorize();

  it('GET: should respond with an unauthorized error for an unauthorized user', function(done) {
    request(app)
    .get('/api/users')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('GET: should respond with a forbidden error for an unauthorized user', function(done) {
    user
    .get('/api/users')
    .expect(403)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('GET: should respond with JSON array for an authorized admin user', function(done) {
    admin
    .get('/api/users')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.be.instanceof(Array);
      done();
    });
  });

  it('POST: should respond with token', function(done) {
    request(app)
    .post('/api/users')
    .send({
      email: 'newUser@example.com',
      password: 'password'
    })
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('token');
      done();
    });
  });
});

describe('API: /api/users/:id/password_reset', function() {
  it('POST: should respond with Not found for a missing user', function(done) {
    request(app)
    .post('/api/users/1/password_reset')
    .send({email: 'foo@baduser.com'})
    .expect(404)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('POST: should respond with an OK for an existing user', function(done) {
    request(app)
    .post('/api/users/1/password_reset')
    .send({email: '1@testuser.com'})
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });
});

describe('API: /api/users/reset_token', function() {
  var token;
  var oldPasswordHash;
  before(function(done) {
    user
    .getData()
    .then(function (data) { return data.setToken();})
    .then(function (data) {
      token = data.token;
      oldPasswordHash = data.hashedPassword;
      done();
    });
  });

  it('POST: should respond with Unauthorized for a missing token', function(done) {
    request(app)
    .post('/api/users/reset_token')
    .send({
      token: 'mytoken',
      email: 'foo@baduser.com',
      newPassword: 'password2'})
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('POST: should respond with a user with a new password for a good token and email', function(done) {
    request(app)
    .post('/api/users/reset_token')
    .send({
      token: token,
      email: '1@testuser.com',
      newPassword: 'password2'})
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('hashedPassword');
      res.body.hashedPassword.should.not.equal(oldPasswordHash);
      done();
    });
  });
});
