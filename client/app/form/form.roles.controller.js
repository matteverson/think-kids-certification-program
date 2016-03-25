'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormRolesCtrl', function($scope, $http, $stateParams, $location) {

    $scope.today = moment().toDate();

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
              return role.name !== 'user';
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

    $scope.saveRoles = (roles, classes) => {
      roles = roles.filter(role => role.permitted === true)
                   .map(role => role.name);

      classes = classes.filter(clas => clas.permitted === true)
                       .map(clas => clas.name);

      const { startDate, endDate, isFeedback } = $scope;

      $http.patch('/api/forms/' + $stateParams.id, { roles, classes, isFeedback, startDate, endDate })
        .success(() => $location.path('/admin'));
    };
  });
