'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormRolesCtrl', function($scope, $http, $stateParams, $location) {
    $http.get('/api/roles')
      .success(function(roles) {
        $http.get('/api/forms/' + $stateParams.id)
          .success(function(form) {
            $scope.roles = roles.filter(function(role) {
              return role.name !== 'user' && role.name !== 'inst' && role.name !== 'admin';
            }).map(function(role) {
              if (form.roles.indexOf(role.name) !== -1) {
                role.permitted = true;
              } else {
                role.permitted = false;
              }
              return role;
            });
          });
      });

    $scope.saveRoles = function(data) {
      var roles = data.filter(function(role) {
        return role.permitted === true;
      }).map(function(role) {
        return role.name;
      });
      roles.push('admin');
      roles.push('inst');

      var isFeedback;

      if ($scope.Feedback === 'Yes') {
        isFeedback = true;
      } else {
        isFeedback = false;
      }

      $http.patch('/api/forms/' + $stateParams.id, {
          roles: roles,
          isFeedback: isFeedback
        })
        .success(function() {
          $location.path('/admin');
        });
    };
  });
