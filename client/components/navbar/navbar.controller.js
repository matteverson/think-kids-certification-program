'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('NavbarCtrl', ($scope, $location, Auth, $http, $mdSidenav, Heading) => {
    $scope.toggleMenu = () => {
      $mdSidenav('left').toggle();
    };

    if (window.location.pathname !== '/admin' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/') {
      $scope.showGoBack = true;
    }

    $scope.heading = Heading.getHeading;

    if (Auth.isLoggedIn()) {
      $http.get(`/api/users/${Auth.getCurrentUser()._id}`)
        .success(user => {
          $scope.newAnnouncement = () => {
            const announcements = user.announcements.filter(announcement =>
              !announcement.read
            ).filter(announcement => announcement.recieveDate <= Date.now());

            if (announcements.length > 0) {
              return true;
            }

            return false;
          };

          $scope.newMessage = () => {
            const messages = user.messages.filter(message => !message.read);

            if (messages.length > 0) {
              return true;
            }

            return false;
          };
        });
    }

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = () => {
      Auth.logout();
      $location.path('/login');
    };
  });
