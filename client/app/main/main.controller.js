'use strict';

angular.module('thinkKidsCertificationProgramApp')
.controller('MainCtrl', function ($scope, $http, Auth, $location, Heading) {

  Heading.setHeading('Home');

  if(Auth.isAdmin()) {
    $location.path('/admin');
  }

  $scope.forms = [];
  $scope.submissions = [];
  $scope.submissionFields = [];
  $scope.noClasses = false;
  $scope.noAssignments = false;
  $scope.viewWelcome = true;

  $http.get('/api/classes')
    .success(function(classes) {
      $scope.classes = classes.filter(function(clas) {
        return clas.students.indexOf(Auth.getCurrentUser().name) > -1 || clas.instructors.indexOf(Auth.getCurrentUser().name) > -1;
      });

      if($scope.classes.length === 0) {
        $scope.noClasses = true;
      }
    });

  const updateSubmittedWork = () => {
    $scope.submissions = [];

    $http.get('/api/forms/mine').success(forms => {
      $scope.forms = forms.filter(({startDate, endDate}) => {
        if(startDate === undefined) {
          startDate = moment();
        }

        if(endDate === undefined) {
          endDate = moment().add(1, 'd');
        }

        console.log(startDate);
        console.log(endDate);

        const showForm = moment().isBetween(startDate, endDate);
        return showForm;
      });

      if($scope.forms.length === 0) {
        $scope.noAssignments = true;
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

                if(moment(field.val, moment.ISO_8601).isValid()) {
                  field.val = moment(field.val).format('MMMM Do, YYYY');
                }

                filteredData.push(field);
              }
            });

            $scope.submissions.push({
              name: form.name + ' - ' + moment.unix(data.onTime).fromNow(),
              fields: filteredData,
              form: form
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
    const feedback = $scope.submissions[index].fields.filter(field => field.prop === 'feedback');

    if (feedback[0]) {
      $scope.feedback = feedback[0].val;
    }

    $scope.submissionFields = $scope.submissions[index].fields.filter(field => field.prop !== 'feedback');
  };

  const cancelSubmission = () => {
    $scope.selectedSubmission = null;
    $scope.submissionFields = [];
  };

  $scope.viewForm = (form, index) => {
    $scope.viewWelcome = false;
    cancelSubmission();
    $scope.selectedForm = index;
    $scope.form = {};
    $scope.form.btnSubmitText = form.data[0].btnSubmitText;
    $scope.form.btnCancelText = form.data[0].btnCancelText;
    $scope.form.fieldsModel = form.data[0].edaFieldsModel;
    $scope.form.dataModel = {};
  };

  $scope.submitForm = () => {
    const form = $scope.forms[$scope.selectedForm];
    const formFieldsData = form.data[0].edaFieldsModel;
    const formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
    const formSubmittedData = {};

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

    formSubmittedData.onTime = moment().unix();
    formSubmittedData.byName = Auth.getCurrentUser().name;

    $http.patch('/api/forms/' + form._id, {
        submittedData: formSubmittedData
      })
      .success(() => {
        $scope.selectedForm = null;
        $scope.form = {};
        $scope.form.dataModel = {};
        updateSubmittedWork();
      });
  };

  $scope.cancelForm = () => {
    $scope.selectedForm = null;
    $scope.form = {};
    $scope.form.dataModel = {};
  };
});
