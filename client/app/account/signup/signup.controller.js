'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('SignupCtrl', function ($scope, Auth, $http, $location, $stateParams) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          roles: [],
          prof: {
            avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg'
          },
          active: true
        })
        .then( function(user) {
          // Account created, redirect to admin list of all users
          $location.path('/signup/' + user.id + '/roles');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    if($stateParams.userID) {
      $http.get('/api/roles')
        .success(function(roles) {
          $http.get('/api/users/' + $stateParams.userID)
            .success(function(user) {
              $scope.roles = roles.map(function(role) {
                if(user.roles.indexOf(role.name) !== -1) {
                  role.permitted = true;
                } else {
                  role.permitted = false;
                }
                return role;
              });

              $scope.roles = $scope.roles.filter(role => role.name !== 'user' );
            });
        });

      $scope.saveRoles = function(data) {
        var roles = data.filter(function(role) {
          return role.permitted === true;
        }).map(function(role) {
          return role.name;
        });

        roles.push('user');

        $http.patch('/api/users/'+$stateParams.userID, {roles: roles})
          .success(function() {
            $location.path('/admin');
          });
      };
    }
  });
