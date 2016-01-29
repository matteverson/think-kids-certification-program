'use strict';

describe('Controller: newRoleCtrl', function () {

  // load the controller's module
  beforeEach(module('thinkKidsCertificationProgramApp'));

  var RolesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RolesCtrl = $controller('newRoleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
