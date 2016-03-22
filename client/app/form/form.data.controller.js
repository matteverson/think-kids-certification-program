'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormDataCtrl', function($scope, $http, $stateParams, $location, Auth) {
    if (window.location.pathname.indexOf('feedback') > -1) {
      if (window.location.pathname.indexOf('new') > -1) {
        $http.get('/api/forms/' + $stateParams.formId)
          .success(function(form) {
            $scope.form = form;
            $scope.form.btnSubmitText = form.data[0].btnSubmitText;
            $scope.form.btnCancelText = form.data[0].btnCancelText;
            $scope.form.fieldsModel = form.data[0].edaFieldsModel;
            $scope.form.dataModel = {};
            $scope.viewForm = true;

            $scope.form.submitFormEvent = function() {
              var formFieldsData = form.data[0].edaFieldsModel;
              var formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
              var formSubmittedData = {};

              for (var i = 0; i < formSubmittedDataProps.length; i++) {
                for (var x = 0; x < formFieldsData.length; x++) {
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
              $http.get('/api/forms/' + $stateParams.id)
                .success(function(form) {
                  var formData = form.submittedData.map(function(data) {
                    if (String(data.onTime) === String($stateParams.onTime)) {
                      data.feedback = formSubmittedData;
                    }

                    return data;
                  });

                  $http.patch('/api/forms/' + $stateParams.id, {
                      submittedData: formData
                    })
                    .success(function() {
                      $location.path('/');
                    });
                });
            };
          });
      } else if (window.location.pathname.indexOf('view') > -1) {
        $http.get('/api/forms/' + $stateParams.id)
          .success(function(form) {
            $scope.isFeedback = true;
            $scope.data = form.submittedData.filter(function(data) {
              return data.feedback && String(data.onTime) === String($stateParams.onTime);
            });
            $scope.data = $scope.data[0].feedback[0];
            var dataProps = Object.getOwnPropertyNames($scope.data);
            var data = [];

            for (var i = 0; i < dataProps.length; i++) {
              if (dataProps[i] === 'byName') {
                continue;
              } else if (dataProps[i] === 'onTime') {
                continue;
              } else if (dataProps[i] === 'grade') {
                continue;
              } else {
                var tempData = {};
                tempData.prop = dataProps[i];
                tempData.val = $scope.data[dataProps[i]];
                data.push(tempData);
              }
            }
            $scope.data = data;
          });
      } else {
        $http.get('/api/forms')
          .success(function(forms) {
            $scope.forms = forms.filter(function(forms) {
              return forms.isFeedback;
            });
            $scope.formID = $stateParams.id;
            $scope.onTime = $stateParams.onTime;
          });
      }
    } else {
      $http.get('/api/forms/' + $stateParams.id)
        .success(function(form) {
          $scope.form = $.extend(true, {}, form);
          if ($stateParams.onTime) {
            $scope.showData = false;

            $http.get('/api/roles')
              .success(roles => {
                roles = roles.filter(role => role.instructor || role.name === 'Admin')
                             .map(role => role.name);

                $scope.isInstructor = Auth.getCurrentUser().roles.filter(role => {
                  return roles.indexOf(role) > -1;
                }).length > 0;
              });

            $scope.pass = function() {
              var submittedData = form.submittedData.map(function(data) {
                if (String(data.onTime) === String($stateParams.onTime)) {
                  data.grade = 'Pass';
                }
                return data;
              });

              $http.patch('/api/forms/' + $stateParams.id, {
                submittedData: submittedData
              });
              $location.path('/form/' + $stateParams.id + '/data/' + $stateParams.onTime + '/feedback');
            };

            $scope.fail = function() {
              var submittedData = form.submittedData.map(function(data) {
                if (String(data.onTime) === String($stateParams.onTime)) {
                  data.grade = 'Fail';
                }
                return data;
              });

              $http.patch('/api/forms/' + $stateParams.id, {
                submittedData: submittedData
              });
              $location.path('/form/' + $stateParams.id + '/data/' + $stateParams.onTime + '/feedback');
            };

            $scope.form.submittedData = $scope.form.submittedData.filter(function(data) {
              return String(data.onTime) === String($stateParams.onTime);
            });
            $scope.form.submittedData = $scope.form.submittedData[0];

            var dataProps = Object.getOwnPropertyNames($scope.form.submittedData);
            var data = [];

            for (var i = 0; i < dataProps.length; i++) {
              if (dataProps[i] === 'byName') {
                continue;
              } else if (dataProps[i] === 'onTime') {
                continue;
              } else if (dataProps[i] === 'grade') {
                continue;
              } else {
                var tempData = {};
                tempData.prop = dataProps[i];
                tempData.val = $scope.form.submittedData[dataProps[i]];
                data.push(tempData);
              }
            }
            $scope.data = data;
          } else {
            $scope.form.submittedData = $scope.form.submittedData.map(function(data) {
              if (data.grade === undefined) {
                data.grade = 'Not graded';
              }

              if (data.feedback !== undefined) {
                $scope.showFeedback = true;
              }

              return data;
            });

            $scope.showData = true;
            $scope.deleteData = function(data) {
              form.submittedData.splice(form.submittedData.indexOf(data), 1);
              var submittedData = form.submittedData;
              $http.patch('/api/forms/' + $stateParams.id, {
                submittedData: submittedData
              });
            };
          }
        });
    }
  });
