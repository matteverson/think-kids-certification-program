'use strict';

var app = require('../..');
var request = require('supertest');

describe('Role API:', function() {

  describe('GET /api/roles', function() {
    var roles;

    beforeEach(function(done) {
      request(app)
        .get('/api/roles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          roles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      roles.should.be.instanceOf(Array);
    });

  });

});
