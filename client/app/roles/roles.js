'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newRole', {
        url: '/roles/new',
        templateUrl: 'app/roles/new.html',
        controller: 'newRoleCtrl'
      })
      .state('roleFees', {
        url: '/roles/fees',
        templateUrl: 'app/roles/fees.html',
        controller: 'RoleFeesCtrl'
      });
  });
