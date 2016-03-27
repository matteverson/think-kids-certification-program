'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function($scope, $http, $stateParams, $location, Auth, $mdToast) {
    if ($stateParams.id) {
      if (window.location.pathname.indexOf('data') === -1 && window.location.pathname.indexOf('roles') === -1) {
        $scope.viewForm = true;

        $http.get('/api/forms/' + $stateParams.id)
          .success(function(form) {

            if(form.endDate === undefined) {
              form.endDate = moment().add(1, 'd');
            } else if(moment().isAfter(form.endDate)) {
              if(!Auth.isAdmin()) {
                $location.path('/');
              }
            }

            form.unlocked = moment().isBetween(form.startDate, form.endDate);

            let permittedRoles = form.roles.filter(role => {
              return Auth.getCurrentUser().roles.indexOf(role) !== -1;
            }).length;

            if(Auth.getCurrentUser().roles.indexOf('Admin') !== -1) {
              permittedRoles = 1;
            }

            const permittedClasses = form.classes.filter(clas => {
              return Auth.getCurrentUser().classes.indexOf(clas) !== -1;
            }).length;

            if (permittedRoles === 0 && permittedClasses === 0) {
              $location.path('/');
            } else {
              $scope.form = {};
              $scope.form.btnSubmitText = form.data[0].btnSubmitText;
              $scope.form.btnCancelText = form.data[0].btnCancelText;
              $scope.form.fieldsModel = form.data[0].edaFieldsModel;
              $scope.form.dataModel = {};

              $scope.form.submitFormEvent = function() {
                if(!form.unlocked) {
                  const toast = $mdToast.simple()
                        .textContent('The form is locked! You cannot submit it before ' + moment(form.startDate).format('MMMM Do, YYYY'))
                        .action('OK')
                        .highlightAction('false')
                        .position('bottom right');

                  $mdToast.show(toast);
                  return;
                }

                const formFieldsData = form.data[0].edaFieldsModel;
                const formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
                let formSubmittedData = {};

                // Name all fields with their labels instead of random IDs
                formSubmittedDataProps.forEach(prop => {
                  formFieldsData.forEach(field => {
                    field.columns.forEach(column => {
                      if(column.control.key === prop) {
                        formSubmittedData[column.control.templateOptions.label] = $scope.form.dataModel[prop];
                      }
                    });
                  });
                });

                formSubmittedData.onTime = Math.floor(Date.now() / 1000);
                formSubmittedData.byName = Auth.getCurrentUser().name;

                form.submittedData.push(formSubmittedData);
                formSubmittedData = form.submittedData;
                $http.patch('/api/forms/' + $stateParams.id, {
                    submittedData: formSubmittedData
                  })
                  .success(function() {
                    $location.path('/');
                  });
              };

              $scope.form.cancelFormEvent = function() {
                $location.path('/admin');
              };
            }
          });
      }
    } else {
      $scope.viewForm = false;

      $scope.saveForm = function(data) {
        $http.post('/api/forms', {
          name: data.formName,
          submittedData: [],
          data: [data],
          roles: [],
          classes: []
        }).success(function(form) {
          $location.path('/form/' + form._id + '/roles');
        });
      };
    }
  });
