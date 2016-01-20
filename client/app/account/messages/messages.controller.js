'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('MessagesCtrl', function ($scope, Auth, $http) {
    $scope.user = Auth.getCurrentUser();
    $scope.deleteMessage = function(message) {
      var index = $scope.user.messages.indexOf(message);
      $scope.user.messages.splice(index, 1);
      $http.patch('/api/users/' + $scope.user._id, $scope.user);
      angular.forEach($scope.user.messages, function(u, i) {
        if (u === message) {
          $scope.user.messages.splice(i, 1);
        }
      });
    };
  });
