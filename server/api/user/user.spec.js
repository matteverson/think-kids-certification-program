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
})
