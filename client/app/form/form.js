'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormCtrl'
      })
      .state('formRoles', {
        url: '/form/:formID/roles',
        templateUrl: 'app/form/roles.html',
        controller: 'FormCtrl'
      })
      .state('formView', {
      	url: '/form/:id',
      	templateUrl: 'app/form/form.html',
      	controller: 'FormCtrl'
      });
  });