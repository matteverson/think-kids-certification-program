'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('announcements', {
        url: '/announcements',
        templateUrl: 'app/announcements/announcements.html',
        controller: 'AnnouncementsCtrl'
      })
      .state('newAnnouncement', {
        url: '/announcements/new',
        templateUrl: 'app/announcements/new.html',
        controller: 'newAnnouncementCtrl'
      });
  });
