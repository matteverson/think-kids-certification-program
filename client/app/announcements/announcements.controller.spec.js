'use strict';

describe('Controller: AnnouncementsCtrl', function () {

  // load the controller's module
  beforeEach(module('thinkKidsCertificationProgramApp'));

  var AnnouncementsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnouncementsCtrl = $controller('AnnouncementsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
