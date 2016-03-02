'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormRolesCtrl', function($scope, $http, $stateParams, $location) {
    $http.get('/api/roles')
      .success(function(roles) {
        $http.get('/api/forms/' + $stateParams.id)
          .success(function(form) {

            $http.get('/api/classes')
              .success(function(classes) {
                $scope.classes = classes.map(function(clas) {
                  if(form.classes.indexOf(clas.name) > -1) {
                    clas.permitted = true;
                  } else {
                    clas.permitted = false;
                  }
                  return clas;
                });
              });

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

    $scope.saveRoles = function(roles, classes) {
      roles = roles.filter(function(role) {
        return role.permitted === true;
      }).map(function(role) {
        return role.name;
      });
      roles.push('admin');
      roles.push('inst');

      classes = classes.filter(function(clas) {
        return clas.permitted === true;
      }).map(function(clas) {
        return clas.name;
      });

      var isFeedback;

      if ($scope.Feedback === 'Yes') {
        isFeedback = true;
      } else {
        isFeedback = false;
      }

      $http.patch('/api/forms/' + $stateParams.id, {
          roles: roles,
          classes: classes,
          isFeedback: isFeedback
        })
        .success(function() {
          $location.path('/admin');
        });
    };
  });
