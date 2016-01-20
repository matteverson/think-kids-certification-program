'use strict';

angular.module('thinkKidsCertificationProgramApp')
.controller('MainCtrl', function ($scope, $http) {
  $scope.forms = [];

  $http.get('/api/forms/mine').success(function(forms) {
    $scope.forms = forms;
  });

  $scope.viewForm = function(form) {
    $scope.form = {};
    $scope.form.btnSubmitText = form.data[0].btnSubmitText;
    $scope.form.btnCancelText = form.data[0].btnCancelText;
    $scope.form.fieldsModel = form.data[0].edaFieldsModel;
    $scope.form.dataModel = {};
  };
});
