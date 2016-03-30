'use strict';

angular.module('thinkKidsCertificationProgramApp')
.controller('MainCtrl', ($scope, $http, Auth, $location, Heading, $mdToast, $mdDialog) => {
  Heading.setHeading('Home');

  if (Auth.isAdmin()) {
    $location.path('/admin');
  }

  $http.get('/api/roles')
    .success(roles => {
      const instructorRoles = roles.filter(role => role.instructor)
                                   .map(role => role.name);

      $scope.isInst = Auth.getCurrentUser().roles.filter(role =>
        instructorRoles.indexOf(role) > -1
      ).length > 0;

      if ($scope.isInst) {
        $http.get('/api/forms')
          .success(forms => {
            $scope.forms = forms;
          });

        $scope.deleteForm = (form, ev) => {
          const confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the form?')
            .textContent('This action is irreversible.')
            .ariaLabel('Delete form')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(() => {
            $http.delete(`/api/forms/${form._id}`)
              .success(() => {
                angular.forEach($scope.forms, (u, i) => {
                  if (u === form) {
                    $scope.forms.splice(i, 1);
                  }
                });
                $scope.showToast('Form deleted.');
              });
          });
        };
      } else {
        $scope.forms = [];
        $scope.submissions = [];
        $scope.submissionFields = [];
        $scope.noClasses = false;
        $scope.noAssignments = false;
        $scope.viewWelcome = true;

        $http.get('/api/classes')
          .success(classes => {
            $scope.classes = classes.filter(clas =>
              clas.students.indexOf(Auth.getCurrentUser().name) > -1 ||
                    clas.instructors.indexOf(Auth.getCurrentUser().name) > -1
            );

            if ($scope.classes.length === 0) {
              $scope.noClasses = true;
            }
          });

        const updateSubmittedWork = () => {
          $scope.submissions = [];

          $http.get('/api/forms/mine').success(forms => {
            forms = forms
            .filter(form => {
              if (moment().isAfter(form.endDate)) {
                return false;
              }

              return true;
            })
            .map(form => {
              if (form.endDate === undefined) {
                form.endDate = moment().add(1, 'd');
              }

              form.unlocked = moment().isBetween(form.startDate, form.endDate);
              return form;
            });

            $scope.forms = forms.filter(form => form.unlocked);
            $scope.disabledForms = forms.filter(form => !form.unlocked);

            if ($scope.forms.length === 0) {
              $scope.noAssignments = true;
            }

            if ($scope.disabledForms.length === 0) {
              $scope.noLockedAssignments = true;
            }

            forms.forEach(form => {
              form.submittedData.forEach(data => {
                if (data.byName === Auth.getCurrentUser().name) {
                  const dataProps = Object.getOwnPropertyNames(data);
                  const filteredData = [];

                  dataProps.forEach(prop => {
                    if (prop === 'byName') {
                      return;
                    } else if (prop === 'onTime') {
                      return;
                    } else {
                      const field = {};
                      field.prop = prop;
                      field.val = data[prop];

                      if (moment(field.val, moment.ISO_8601).isValid()) {
                        field.val = moment(field.val).format('MMMM Do, YYYY');
                      }

                      filteredData.push(field);
                    }
                  });

                  $scope.submissions.push({
                    name: `${form.name} - ${moment.unix(data.onTime).fromNow()}`,
                    fields: filteredData,
                    form,
                  });
                }
              });
            });
          });
        };

        updateSubmittedWork();

        $scope.viewSubmission = (submission, index) => {
          $scope.viewWelcome = false;
          $scope.cancelForm();
          $scope.selectedSubmission = index;
          const feedback = $scope.submissions[index].fields
                           .filter(field => field.prop === 'feedback');

          if (feedback[0]) {
            $scope.feedback = feedback[0].val;
          }

          $scope.submissionFields = $scope.submissions[index].fields.filter(
            field => field.prop !== 'feedback'
          );
        };

        const cancelSubmission = () => {
          $scope.selectedSubmission = null;
          $scope.submissionFields = [];
        };

        $scope.viewForm = (form, index) => {
          $scope.viewWelcome = false;
          cancelSubmission();
          $scope.selectedForm = form;
          $scope.index = index;
          $scope.form = {};
          $scope.form.btnSubmitText = form.data[0].btnSubmitText;
          $scope.form.btnCancelText = form.data[0].btnCancelText;
          $scope.form.fieldsModel = form.data[0].edaFieldsModel;
          $scope.form.dataModel = {};
        };

        $scope.submitForm = () => {
          let form;

          if ($scope.selectedForm.unlocked) {
            form = $scope.forms[$scope.index];
          } else {
            form = $scope.disabledForms[$scope.index];
          }

          const formFieldsData = form.data[0].edaFieldsModel;
          const formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
          const formSubmittedData = {};

          if (!form.unlocked) {
            const toast = $mdToast.simple()
            .textContent(`The form is locked! You cannot submit it before\
                         ${moment(form.startDate).format('MMMM Do, YYYY')}`)
                  .action('OK')
                  .highlightAction('false')
                  .position('bottom right');

            $mdToast.show(toast);
            return;
          }

          // Name all fields with their labels instead of random IDs
          formSubmittedDataProps.forEach(prop => {
            formFieldsData.forEach(field => {
              field.columns.forEach(column => {
                if (column.control.type === 'radio' && column.control.key === prop) {
                  formSubmittedData[column.control.templateOptions.label] =
                    column.control.templateOptions.options[$scope.form.dataModel[prop]].name;
                } else if (column.control.key === prop) {
                  formSubmittedData[column.control.templateOptions.label]
                                            = $scope.form.dataModel[prop];
                }
              });
            });
          });

          formSubmittedData.onTime = moment().unix();
          formSubmittedData.byName = Auth.getCurrentUser().name;

          form.submittedData.push(formSubmittedData);
          const submittedData = form.submittedData;

          $http.patch(`/api/forms/${form._id}`, { submittedData })
            .success(() => {
              $scope.selectedForm = null;
              $scope.index = null;
              $scope.form = {};
              $scope.form.dataModel = {};
              updateSubmittedWork();
            });
        };

        $scope.cancelForm = () => {
          $scope.selectedForm = null;
          $scope.index = null;
          $scope.viewWelcome = true;
          $scope.form = {};
          $scope.form.dataModel = {};
        };
      }
    });
});
