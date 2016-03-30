'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormRolesCtrl', ($scope, $http, $stateParams, $location, Heading) => {

    $scope.today = moment().toDate();

    $http.get('/api/roles')
      .success(roles => {
        $http.get(`/api/forms/${$stateParams.id}`)
          .success(form => {
            $scope.isFeedback = form.isFeedback;
            $scope.isPoll = form.isPoll;

            let numOfFields = form.data[0].edaFieldsModel.length;

            form.data[0].edaFieldsModel.forEach(row => {
              if (row.columns.length > 1) {
                numOfFields += row.columns.length - 1;
              }
            });

            const checkboxesAndRadio = form.data[0].edaFieldsModelStringified
                                        .match(/(\"type\":\"checkbox\"|\"type\":\"radio\")/g);

            let numOfCheckboxesAndRadio = 0;

            if (checkboxesAndRadio) {
              numOfCheckboxesAndRadio = checkboxesAndRadio.length;
            }

            if (numOfFields === numOfCheckboxesAndRadio) {
              $scope.showPoll = true;
            }

            Heading.setHeading(`Admin Panel > Edit ${form.name}'s details`);

            if (form.startDate) {
              $scope.startDate = moment(form.startDate).toDate();
            }

            if (form.endDate) {
              $scope.endDate = moment(form.endDate).toDate();
            }

            $http.get('/api/classes')
              .success(classes => {
                $scope.classes = classes.map(clas => {
                  if (form.classes.indexOf(clas.name) > -1) {
                    clas.permitted = true;
                  } else {
                    clas.permitted = false;
                  }
                  return clas;
                });
              });

            $scope.roles = roles.filter((role) => role.name !== 'user')
                                .map((role) => {
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

      const { endDate, isFeedback, isPoll } = $scope;
      let { startDate } = $scope;

      if (startDate === undefined) {
        startDate = moment().toDate();
      }

      $http.patch(`/api/forms/${$stateParams.id}`,
                  { roles, classes, isFeedback, startDate, endDate, isPoll })
        .success(() => $location.path('/admin'));
    };
  });
