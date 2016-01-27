'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('NotificationsCtrl', function ($scope, Auth, $http) {
    $http.get('/api/users/'+Auth.getCurrentUser()._id)
      .success(function(user) {
        $scope.user = user;
        $scope.notifications = $scope.user.notifications.slice().reverse();

        for(var i = 0; i < $scope.user.notifications.length; i++) {
          $scope.user.notifications[i].read = true;
        }

        $http.patch('/api/users/' + $scope.user._id, $scope.user);
      });
  });
