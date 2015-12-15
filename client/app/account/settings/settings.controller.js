'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser().prof;

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.editProfile = function() {
      $scope.submitted = true;
      $http.patch('/api/users/'+Auth.getCurrentUser()._id, {prof: $scope.user})
        .success(function(user) {
          console.log(user);
        });
		};
  });
