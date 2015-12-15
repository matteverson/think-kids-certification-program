'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ProfileCtrl', function ($scope, $stateParams, $http) {
    $http.get('/api/users/'+$stateParams.id)
      .success(function(user) {
        $scope.user = user;
      });
  });
