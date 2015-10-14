'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var roleCtrlStub = {
  index: 'roleCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var roleIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './role.controller': roleCtrlStub
});

describe('Role API Router:', function() {

  it('should return an express router instance', function() {
    roleIndex.should.equal(routerStub);
  });

  describe('GET /api/roles', function() {

    it('should route to role.controller.index', function() {
      routerStub.get
        .withArgs('/', 'roleCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
