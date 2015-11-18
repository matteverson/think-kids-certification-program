'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormCtrl'
      })
      .state('formView', {
      	url: '/form/:id',
      	templateUrl: 'app/form/form.html',
      	controller: 'FormCtrl'
      })
      .state('formRoles', {
        url: '/form/:id/roles',
        templateUrl: 'app/form/roles.html',
        controller: 'FormCtrl'
      })
      .state('formData', {
        url: '/form/:id/data',
        templateUrl: '/app/form/data.html',
        controller: 'FormCtrl'
      })
      .state('formUserData', {
        url: '/form/:id/data/:by',
        templateUrl: '/app/form/data.html',
        controller: 'FormCtrl'
      });
  });