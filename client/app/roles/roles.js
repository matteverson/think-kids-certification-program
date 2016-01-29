'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newRole', {
        url: '/roles/new',
        templateUrl: 'app/roles/new.html',
        controller: 'newRoleCtrl'
      });
  });
