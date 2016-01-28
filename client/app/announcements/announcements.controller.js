'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('AnnouncementsCtrl', function ($scope, Auth, $http) {
    $http.get('/api/users/'+Auth.getCurrentUser()._id)
      .success(function(user) {
        $scope.user = user;
        $scope.announcements = $scope.user.announcements.slice().reverse();

        for(var i = 0; i < $scope.user.announcements.length; i++) {
          $scope.user.announcements[i].read = true;
        }

        $http.patch('/api/users/' + $scope.user._id, $scope.user);
      });
  });
