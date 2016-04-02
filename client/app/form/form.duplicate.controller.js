'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormDuplicateCtrl', ($scope, $http, $stateParams, $location, Heading, $mdToast) => {

    $scope.today = moment().toDate();

    $http.get('/api/roles')
      .success(roles => {
        $http.get(`/api/forms/${$stateParams.id}`)
          .success(form => {
            $scope.form = form;
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
                $scope.classes = classes;
                const classNames = classes.map(clas => clas.name);
                $scope.selectedClass = classNames.indexOf(form.clas);
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

      classes = classes.map(clas => clas.name);

      const { endDate, isFeedback, isPoll } = $scope;
      let { startDate } = $scope;

      if (startDate === undefined) {
        startDate = moment().toDate();
      }

      const clas = classes[$scope.selectedClass];
      $http.post('/api/forms/',
           { name: $scope.form.name,
             roles, clas, data: $scope.form.data, isFeedback, startDate, endDate, isPoll })
        .success(() => $location.path('/admin'));
    };
  });
