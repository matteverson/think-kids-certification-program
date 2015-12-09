'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function($scope, $http, $stateParams, $location, Auth) {
    if ($stateParams.id) {
      if (window.location.pathname.indexOf('data') === -1 && window.location.pathname.indexOf('roles') === -1) {
        $scope.viewForm = true;

        $http.get('/api/forms/' + $stateParams.id)
          .success(function(form) {
            var permitted = form.roles.filter(function(role) {
              return Auth.getCurrentUser().roles.indexOf(role) !== -1;
            }).length;

            if (permitted === 0) {
              $location.path('/');
            } else {
              $scope.form = {};
              $scope.form.btnSubmitText = form.data[0].btnSubmitText;
              $scope.form.btnCancelText = form.data[0].btnCancelText;
              $scope.form.fieldsModel = form.data[0].edaFieldsModel;
              $scope.form.dataModel = {};

              $scope.form.submitFormEvent = function() {
                var formFieldsData = form.data[0].edaFieldsModel;
                var formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
                var formSubmittedData = {};

                for (var i = 0; i < formSubmittedDataProps.length; i++) {
                  for (var x = 1; x < formFieldsData.length; x++) {
                    for (var y = 0; y < formFieldsData[x].columns.length; y++) {
                      if (formFieldsData[x].columns[y].control.key === formSubmittedDataProps[i]) {
                        formSubmittedData[formFieldsData[x].columns[y].control.templateOptions.label] = $scope.form.dataModel[formSubmittedDataProps[i]];
                      }
                    }
                  }
                }

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
                console.log('Form cancelled!');
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
          roles: []
        }).success(function(form) {
          $location.path('/form/' + form._id + '/roles');
        });
      };
    }
  });
