'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http, $mdSidenav, Heading) {
    $scope.toggleMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.heading = Heading.getHeading;

    if(Auth.isLoggedIn()) {
      $http.get('/api/users/'+Auth.getCurrentUser()._id)
        .success(function(user) {
          $scope.newAnnouncement = function() {
            var announcements = user.announcements.filter(function(announcement) {
              return !announcement.read;
            }).filter(function(announcement) {
              return announcement.recieveDate <= Date.now();
            });

            if(announcements.length > 0) {
              return true;
            }

            return false;
          };

          $scope.newMessage = function() {
            var messages = user.messages.filter(function(message) {
              return !message.read;
            });

            if(messages.length > 0) {
              return true;
            }

            return false;
          };
      });
    }

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };
  });
