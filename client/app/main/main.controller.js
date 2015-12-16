'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.forms = [];

    $http.get('/api/forms/mine').success(function(forms) {
      $scope.forms = forms;
    });
  });
