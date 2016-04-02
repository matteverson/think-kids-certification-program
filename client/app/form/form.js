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
        controller: 'FormRolesCtrl'
      })
      .state('duplicateForm', {
        url: '/form/:id/duplicate',
        templateUrl: 'app/form/duplicate.html',
        controller: 'FormDuplicateCtrl'
      })
      .state('formData', {
        url: '/form/:id/data',
        templateUrl: 'app/form/data.html',
        controller: 'FormDataCtrl'
      })
      .state('formUserData', {
        url: '/form/:id/data/:onTime',
        templateUrl: 'app/form/data.html',
        controller: 'FormDataCtrl'
      })
      .state('formUserDataFeedbackFormChoose', {
        url: '/form/:id/data/:onTime/feedback',
        templateUrl: 'app/form/feedback.html',
        controller: 'FormDataCtrl'
      })
      .state('formUserDataFeedbackForm', {
        url: '/form/:id/data/:onTime/feedback/new/:formId',
        templateUrl: 'app/form/form.html',
        controller: 'FormDataCtrl'
      })
      .state('formUserDataFeedbackView', {
        url: '/form/:id/data/:onTime/feedback/view',
        templateUrl: 'app/form/data.html',
        controller: 'FormDataCtrl'
      });
  });
