'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    if(Auth.isLoggedIn()) {
      $scope.newMessage = false;
      $scope.newAnnouncement = false;

      $http.get('/api/users/'+Auth.getCurrentUser()._id)
        .success(function(user) {
          for(var x = 0; x < user.announcements.length; x++) {
            if(!user.announcements[x].read) {
              $scope.newAnnouncement = true;
              break;
            }
          }

          var messages = user.messages.filter(function(message) {
            return !message.read;
          });

          if(messages.length > 0) {
            $scope.newMessage = true;
          }
      });
    }

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
