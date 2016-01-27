'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('notifications', {
        url: '/notifications',
        templateUrl: 'app/notifications/notifications.html',
        controller: 'NotificationsCtrl'
      })
      .state('newNotification', {
        url: '/notifications/new/:name',
        templateUrl: 'app/notifications/new.html',
        controller: 'newNotificationCtrl'
      });
  });
