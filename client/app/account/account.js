'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl',
        authenticate: true
      })
      .state('roles', {
        url: '/signup/:userID/roles',
        templateUrl: 'app/account/signup/roles.html',
        controller: 'SignupCtrl',
        authenticate: true
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/:id/profile',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('messages', {
        url: '/:id/messages',
        templateUrl: 'app/account/messages/messages.html',
        controller: 'MessagesCtrl'
      })
      .state('newMessage', {
        url: '/:id/messages/new',
        templateUrl: 'app/account/messages/new.html',
        controller: 'newMessageCtrl'
      })
      .state('viewMessage', {
        url: '/:id/messages/:messageID',
        templateUrl: 'app/account/messages/view.html',
        controller: 'viewMessageCtrl'
      })
      .state('forgot', {
        url: '/forgot?t',
        templateUrl: 'app/account/forgot/forgot.html',
        controller: 'ForgotCtrl'
      });
  });
