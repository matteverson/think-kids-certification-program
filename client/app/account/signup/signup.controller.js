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
          active: true
        })
        .then( function(user) {
          // Account created, redirect to admin list of all users
          $location.path('/singup/' + user.id + '/roles');
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
      var isAdmin = false;
      var isInstructor = false;

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

              if(user.roles.indexOf('admin') !== -1) {
                isAdmin = true;
              }

              if(user.roles.indexOf('inst') !== -1) {
                isInstructor = true;
              }

              $scope.roles = $scope.roles.splice(3, $scope.roles.length-3);
            });
        });

      $scope.saveRoles = function(data) {
        var roles = data.filter(function(role) {
          return role.permitted === true;
        }).map(function(role) {
          return role.name;
        });

        roles.push('user');

        if(isAdmin) {
          roles.push('admin');
        }

        if(isInstructor) {
          roles.push('inst');
        }

        $http.patch('/api/users/'+$stateParams.userID, {roles: roles})
          .success(function() {
            $location.path('/admin');
          });
      };
    }
  });
