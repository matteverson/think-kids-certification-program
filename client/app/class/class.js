'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newClass', {
        url: '/class/new',
        templateUrl: 'app/class/new.html',
        controller: 'newClassCtrl'
      })
      .state('class', {
        url: '/class/:id',
        templateUrl: 'app/class/class.html',
        controller: 'ClassCtrl'
      });
  });
