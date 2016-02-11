'use strict';

angular.module('thinkKidsCertificationProgramApp')
.controller('MainCtrl', function ($scope, $http, Auth) {
  $scope.forms = [];
  $scope.submissions = [];
  $scope.submissionFields = [];
  $scope.noClasses = false;

  $http.get('/api/classes')
    .success(function(classes) {
      $scope.classes = classes.filter(function(clas) {
        return clas.students.indexOf(Auth.getCurrentUser().name) > -1 || clas.instructors.indexOf(Auth.getCurrentUser().name) > -1;
      });

      if($scope.classes.length === 0) {
        $scope.noClasses = true;
      }

      console.log(classes);
    });

  updateSubmittedWork();

  function updateSubmittedWork()
  {
    $scope.submissions = [];
    $http.get('/api/forms/mine').success(function(forms) {
      $scope.forms = forms;
      forms.forEach(function(form) {
        form.submittedData.forEach(function(data) {
          if (data.byName == Auth.getCurrentUser().name) {
            var dataProps = Object.getOwnPropertyNames(data);
            var filteredData = [];

            for (var i = 0; i < dataProps.length; i++) {
              if (dataProps[i] === 'byName') {
                continue;
              } else if (dataProps[i] === 'onTime') {
                continue;
              } else {
                var field = {};
                field.prop = dataProps[i];
                field.val = data[dataProps[i]];
                filteredData.push(field);
              }
            }
            $scope.submissions.push({
              name: form.name + ' - ' + moment.unix(data.onTime).fromNow(),
              fields: filteredData,
              form: form
            });
          }
        });
      });
    });
  }

  $scope.viewSubmission = function(submission, index) {
    $scope.cancelForm();
    $scope.selectedSubmission = index;
    $scope.submissionFields = $scope.submissions[index].fields;
    console.log($scope.submissionFields);
  };

  function cancelSubmission() {
    $scope.selectedSubmission = null;
    $scope.submissionFields = [];
  }

  $scope.viewForm = function(form, index) {
    cancelSubmission();
    $scope.selectedForm = index;
    $scope.form = {};
    $scope.form.btnSubmitText = form.data[0].btnSubmitText;
    $scope.form.btnCancelText = form.data[0].btnCancelText;
    $scope.form.fieldsModel = form.data[0].edaFieldsModel;
    $scope.form.dataModel = {};
  };

  $scope.submitForm = function() {
    var form = $scope.forms[$scope.selectedForm];
    var formFieldsData = form.data[0].edaFieldsModel;
    var formSubmittedDataProps = Object.getOwnPropertyNames($scope.form.dataModel);
    var formSubmittedData = {};

    // Name all fields with their labels instead of random IDs
    for (var i = 0; i < formSubmittedDataProps.length; i++) {
      for (var x = 0; x < formFieldsData.length; x++) {
        for (var y = 0; y < formFieldsData[x].columns.length; y++) {
          if (formFieldsData[x].columns[y].control.key === formSubmittedDataProps[i]) {
            formSubmittedData[formFieldsData[x].columns[y].control.templateOptions.label] = $scope.form.dataModel[formSubmittedDataProps[i]];
          }
        }
      }
    }

    formSubmittedData.onTime = moment().unix();
    formSubmittedData.byName = Auth.getCurrentUser().name;

    console.log('Submitting form data', formSubmittedData);
    $http.patch('/api/forms/' + form._id, {
        submittedData: formSubmittedData
      })
      .success(function() {
        $scope.selectedForm = null;
        $scope.form = {};
        $scope.form.dataModel = {};
        updateSubmittedWork();
      });
  };

  $scope.cancelForm = function() {
    $scope.selectedForm = null;
    $scope.form = {};
    $scope.form.dataModel = {};
  };
});
