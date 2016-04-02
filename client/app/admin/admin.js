'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config($stateProvider => {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
      });
  });
