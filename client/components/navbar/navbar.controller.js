'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http, $mdSidenav, Heading, $timeout) {
    $scope.toggleMenu = function() {
        $mdSidenav('left').toggle();
    };

    $timeout(function() {
      $scope.heading = Heading.getHeading();
    });

    if(Auth.isLoggedIn()) {
<<<<<<< 91ed5c025e7721d27f5dba9309b8650404da4bfb
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
=======
      $timeout(function() {
        $scope.newAnnouncement = false;
        $scope.newMessage = false;
      });

      $http.get('/api/users/'+Auth.getCurrentUser()._id)
        .success(function(user) {
          var announcements = user.announcements.filter(function(item) {
            return !item.read;
          });

          if(announcements.length > 0) {
            $timeout(function() {
              $scope.newAnnouncement = true;
            });
          }
>>>>>>> Add heading to top bar

            return false;
          };

          $scope.newMessage = function() {
            var messages = user.messages.filter(function(message) {
              return !message.read;
            });

            if(messages.length > 0) {
              return true;
            }

<<<<<<< 91ed5c025e7721d27f5dba9309b8650404da4bfb
            return false;
          };
=======
          if(messages.length > 0) {
            $timeout(function() {
              $scope.newMessage = true;
            });
          }
>>>>>>> Add heading to top bar
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
