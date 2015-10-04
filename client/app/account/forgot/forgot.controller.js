'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ForgotCtrl', function ($scope, Auth, $stateParams) {
    $scope.user = {};
    $scope.reset = {};
    $scope.errors = {};
    $scope.reset.token = $stateParams.t;
    
    $scope.forgot = function(form) {
      $scope.forgotSubmitted = true;

      if(form.$valid) {
        Auth.requestPasswordReset($scope.user.email)
        .then( function() {
          $scope.errors.requestForm = 'A password reset email has been sent.';
        })
        .catch( function(err) {
          $scope.errors.requestForm = err.message;
        });
      }
    };

    $scope.resetPassword = function(form) {
      $scope.resetSubmitted = true;

      if(form.$valid) {
        Auth.resetPasswordWithToken(
          $scope.reset.token,
          $scope.reset.email,
          $scope.reset.newPassword)
        .then( function() {
          $scope.errors.resetForm = 'Your password has been changed successfully';
        })
        .catch( function(err) {
          $scope.errors.resetForm = err.message;
        });
      }
    }
  });
