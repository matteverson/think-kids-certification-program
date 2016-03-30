'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormDataCtrl', ($scope, $http, $stateParams, $location, Auth, Heading) => {
    if (window.location.pathname.indexOf('feedback') > -1) {
      if (window.location.pathname.indexOf('new') > -1) {
        $http.get(`/api/forms/${$stateParams.formId}`)
          .success(form => {
            $scope.form = form;
            $scope.form.btnSubmitText = form.data[0].btnSubmitText;
            $scope.form.btnCancelText = form.data[0].btnCancelText;
            $scope.form.fieldsModel = form.data[0].edaFieldsModel;
            $scope.form.dataModel = {};
            $scope.viewForm = true;

            $scope.form.submitFormEvent = () => {
              const formFieldsData = form.data[0].edaFieldsModel;
              const formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
              let formSubmittedData = {};

              formSubmittedDataProps.forEach(prop => {
                formFieldsData.forEach(field => {
                  field.columns.forEach(column => {
                    if (column.control.key === prop) {
                      formSubmittedData[column.control.templateOptions.label]
                                                = $scope.form.dataModel[prop];
                    }
                  });
                });
              });

              formSubmittedData.onTime = Math.floor(Date.now() / 1000);
              formSubmittedData.byName = Auth.getCurrentUser().name;

              form.submittedData.push(formSubmittedData);
              formSubmittedData = form.submittedData;
              $http.get(`/api/forms/${$stateParams.id}`)
                .success(form => {
                  const formData = form.submittedData.map(data => {
                    if (String(data.onTime) === String($stateParams.onTime)) {
                      data.feedback = formSubmittedData;
                    }

                    return data;
                  });

                  $http.patch(`/api/forms/${$stateParams.id}`, { submittedData: formData })
                    .success(() => $location.path('/'));
                });
            };
          });
      } else if (window.location.pathname.indexOf('view') > -1) {
        $http.get(`/api/forms/${$stateParams.id}`)
          .success(form => {
            $scope.isFeedback = true;
            $scope.data = form.submittedData.filter(
              data => data.feedback && String(data.onTime) === String($stateParams.onTime)
            );
            $scope.data = $scope.data[0].feedback[0];
            const dataProps = Object.getOwnPropertyNames($scope.data);
            const data = [];

            for (let i = 0; i < dataProps.length; i++) {
              if (dataProps[i] === 'byName') {
                continue;
              } else if (dataProps[i] === 'onTime') {
                continue;
              } else if (dataProps[i] === 'grade') {
                continue;
              } else {
                const tempData = {};
                tempData.prop = dataProps[i];
                tempData.val = $scope.data[dataProps[i]];
                data.push(tempData);
              }
            }
            $scope.data = data;
          });
      } else {
        $http.get('/api/forms')
          .success(forms => {
            $scope.forms = forms.filter(forms => forms.isFeedback);
            $scope.formID = $stateParams.id;
            $scope.onTime = $stateParams.onTime;
          });
      }
    } else {
      $http.get(`/api/forms/${$stateParams.id}`)
        .success(form => {
          if (form.isPoll) {
            const { name, submittedData } = form;

            Heading.setHeading(`${name}'s data`);

            if (submittedData.length > 0) {
              $scope.showPoll = true;
              $scope.showData = true;
              $scope.labels = [];
              $scope.data = [[]];

              submittedData.forEach(submission => {
                $scope.labels = $scope.labels.concat(Object.keys(submission))
                  .filter(label => label !== 'onTime' && label !== 'byName')
                  .map(label => {
                    if (typeof submission[label] !== 'boolean' && submission[label] !== undefined) {
                      label = submission[label];
                    }
                    return label;
                  });
              });

              $scope.labels = _.uniq(_.flatten($scope.labels));

              console.log(submittedData);

              submittedData.forEach(submission => {
                const labels = Object.keys(submission)
                  .filter(label => label !== 'onTime' && label !== 'byName');

                labels.forEach(label => {
                  if ($scope.labels.indexOf(label) > -1) {
                    if ($scope.data[0][$scope.labels.indexOf(label)]) {
                      $scope.data[0][$scope.labels.indexOf(label)] += 1;
                    } else {
                      $scope.data[0][$scope.labels.indexOf(label)] = 1;
                    }
                  } else if ($scope.labels.indexOf(submission[label]) > -1) {
                    // console.log(submission);
                    if ($scope.data[0][$scope.labels.indexOf(submission[label])]) {
                      $scope.data[0][$scope.labels.indexOf(submission[label])] += 1;
                    } else {
                      $scope.data[0][$scope.labels.indexOf(submission[label])] = 1;
                    }
                  }
                });
              });
            } else {
              $scope.noData = true;
            }
          } else {
            $scope.form = $.extend(true, {}, form);
            if ($stateParams.onTime) {
              $scope.showData = false;

              $http.get('/api/roles')
                .success(roles => {
                  roles = roles.filter(role => role.instructor || role.name === 'Admin')
                               .map(role => role.name);

                  $scope.isInstructor = Auth.getCurrentUser().roles.filter(role =>
                    roles.indexOf(role) > -1
                  ).length > 0;
                });

              $scope.pass = () => {
                const submittedData = form.submittedData.map(data => {
                  if (String(data.onTime) === String($stateParams.onTime)) {
                    data.grade = 'Pass';
                  }
                  return data;
                });

                $http.patch(`/api/forms/${$stateParams.id}`, { submittedData });
                $location.path(`/form/${$stateParams.id}/data/${$stateParams.onTime}/feedback'`);
              };

              $scope.fail = () => {
                const submittedData = form.submittedData.map(data => {
                  if (String(data.onTime) === String($stateParams.onTime)) {
                    data.grade = 'Fail';
                  }
                  return data;
                });

                $http.patch(`/api/forms/${$stateParams.id}`, { submittedData });
                $location.path(`/form/${$stateParams.id}/data/${$stateParams.onTime}/feedback`);
              };

              $scope.form.submittedData = $scope.form.submittedData.filter(data =>
                String(data.onTime) === String($stateParams.onTime)
              );
              $scope.form.submittedData = $scope.form.submittedData[0];

              const dataProps = Object.getOwnPropertyNames($scope.form.submittedData);
              const data = [];

              for (let i = 0; i < dataProps.length; i++) {
                if (dataProps[i] === 'byName') {
                  continue;
                } else if (dataProps[i] === 'onTime') {
                  continue;
                } else if (dataProps[i] === 'grade') {
                  continue;
                } else {
                  const tempData = {};
                  tempData.prop = dataProps[i];
                  tempData.val = $scope.form.submittedData[dataProps[i]];
                  data.push(tempData);
                }
              }
              $scope.data = data;
            } else {
              $scope.form.submittedData = $scope.form.submittedData.map(data => {
                if (data.grade === undefined) {
                  data.grade = 'Not graded';
                }

                if (data.feedback !== undefined) {
                  $scope.showFeedback = true;
                }

                return data;
              });

              $scope.showData = true;
              $scope.deleteData = data => {
                form.submittedData.splice(form.submittedData.indexOf(data), 1);
                const submittedData = form.submittedData;
                $http.patch(`/api/forms/${$stateParams.id}`, { submittedData });
              };
            }
          }
        });
    }
  });
