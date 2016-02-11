'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newClass', {
        url: '/class/new',
        templateUrl: 'app/class/new.html',
        controller: 'newClassCtrl'
      })
      .state('editClass', {
        url: '/class/:id/edit',
        templateUrl: 'app/class/new.html',
        controller: 'editClassCtrl'
      })
      .state('class', {
        url: '/class/:id',
        templateUrl: 'app/class/class.html',
        controller: 'ClassCtrl'
      });
  });
