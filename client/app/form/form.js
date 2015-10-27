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
      });
  });