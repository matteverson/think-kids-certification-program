'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function ($scope, $http, $stateParams, $location, Auth) {
    if($stateParams.id) {
      if(window.location.pathname.indexOf('roles') > -1) {
        $http.get('/api/roles')
          .success(function(roles) {
            $http.get('/api/forms/' + $stateParams.id)
              .success(function(form) {
                $scope.roles = roles.filter(function(role) {
                  return role.name !== 'user' && role.name !== 'inst' && role.name !== 'admin';
                }).map(function(role) {
                  if(form.roles.indexOf(role.name) !== -1) {
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

          if($scope.isFeedback === 'Yes') {
            isFeedback = true;
          } else {
            isFeedback = false;
          }

          $http.patch('/api/forms/'+$stateParams.id, {roles: roles, isFeedback: isFeedback})
            .success(function() {
              $location.path('/admin');
            });
         };
      } else if (window.location.pathname.indexOf('data') > -1) {
        if(window.location.pathname.indexOf('feedback') > -1) {
          if(window.location.pathname.indexOf('new') > -1) {
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

                  for(var i = 0; i < formSubmittedDataProps.length; i++) {
                    for(var x = 1; x < formFieldsData.length; x++) {
                      for(var y = 0; y < formFieldsData[x].columns.length; y++) {
                        if(formFieldsData[x].columns[y].control.key === formSubmittedDataProps[i]) {
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
                        if(String(data.onTime) === String($stateParams.onTime)) {
                          data.feedback = formSubmittedData;
                        }

                        return data;
                      });

                      $http.patch('/api/forms/'+$stateParams.id, {submittedData: formData})
                        .success(function() {
                          $location.path('/');
                        });
                    });
                };
              });
          } else if (window.location.pathname.indexOf('view') > -1) {
            $http.get('/api/forms/'+$stateParams.id)
              .success(function(form) {
                $scope.isFeedback = true;
                $scope.data = form.submittedData.filter(function(data) {
                  return data.feedback && String(data.onTime) === String($stateParams.onTime);
                });
                $scope.data = $scope.data[0].feedback[0];
                var dataProps = Object.getOwnPropertyNames($scope.data);
                var data = [];

                for(var i = 0; i < dataProps.length; i++) {
                  if(dataProps[i] === 'byName') {
                    continue;
                  } else if(dataProps[i] === 'onTime') {
                    continue;
                  } else if(dataProps[i] === 'grade') {
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
              if($stateParams.onTime) {
                $scope.showData = false;
                $scope.isInstructor = Auth.getCurrentUser().role === 'admin' || Auth.getCurrentUser().role === 'inst';

                $scope.pass = function() {
                  var submittedData = form.submittedData.map(function(data) {
                    if (String(data.onTime) === String($stateParams.onTime)) {
                      data.grade = 'Pass';
                    }
                    return data;
                  });

                  $http.patch('/api/forms/' + $stateParams.id, {submittedData: submittedData});
                  $location.path('/form/'+$stateParams.id+'/data/'+$stateParams.onTime+'/feedback');
                };

                $scope.fail = function() {
                  var submittedData = form.submittedData.map(function(data) {
                    if (String(data.onTime) === String($stateParams.onTime)) {
                      data.grade = 'Fail';
                    }
                    return data;
                  });

                  $http.patch('/api/forms/' + $stateParams.id, {submittedData: submittedData});
                  $location.path('/form/'+$stateParams.id+'/data/'+$stateParams.onTime+'/feedback');
                };

                $scope.form.submittedData = $scope.form.submittedData.filter(function(data) {
                  return String(data.onTime) === String($stateParams.onTime);
                });
                $scope.form.submittedData = $scope.form.submittedData[0];

                var dataProps = Object.getOwnPropertyNames($scope.form.submittedData);
                var data = [];

                for(var i = 0; i < dataProps.length; i++) {
                  if(dataProps[i] === 'byName') {
                    continue;
                  } else if(dataProps[i] === 'onTime') {
                    continue;
                  } else if(dataProps[i] === 'grade') {
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
                  if(data.grade === undefined) {
                    data.grade = 'Not graded';
                  }

                  if(data.feedback !== undefined) {
                    $scope.showFeedback = true;
                  }

                  return data;
                });

                $scope.showData = true;
                $scope.deleteData = function(data) {
                  form.submittedData.splice(form.submittedData.indexOf(data), 1);
                  var submittedData = form.submittedData;
                  $http.patch('/api/forms/'+$stateParams.id, {submittedData: submittedData});
                };
              }
            });
          }
      } else if (window.location.pathname.indexOf('data') === -1 && window.location.pathname.indexOf('roles') === -1) {
        $scope.viewForm = true;

        $http.get('/api/forms/'+$stateParams.id)
          .success(function(form) {
            var permitted = form.roles.filter(function(role) {
              return Auth.getCurrentUser().roles.indexOf(role) !== -1;
            }).length;

            if(permitted === 0) {
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

                for(var i = 0; i < formSubmittedDataProps.length; i++) {
                  for(var x = 1; x < formFieldsData.length; x++) {
                    for(var y = 0; y < formFieldsData[x].columns.length; y++) {
                      if(formFieldsData[x].columns[y].control.key === formSubmittedDataProps[i]) {
                        formSubmittedData[formFieldsData[x].columns[y].control.templateOptions.label] = $scope.form.dataModel[formSubmittedDataProps[i]];
                      }
                    }
                  }
                }

                formSubmittedData.onTime = Math.floor(Date.now() / 1000);
                formSubmittedData.byName = Auth.getCurrentUser().name;

                form.submittedData.push(formSubmittedData);
                formSubmittedData = form.submittedData;
                $http.patch('/api/forms/'+$stateParams.id, {submittedData: formSubmittedData})
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
        $http.post('/api/forms', { name: data.formName, submittedData: [], data: [data], roles: []}).success(function(form) {
          $location.path('/form/' + form._id + '/roles');
        });
      };
    }
  });
