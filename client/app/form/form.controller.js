'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function ($scope, $http, $stateParams, $location) {
    $scope.message = 'Hello';
    $scope.saveForm = function(data) {
    	$http.post('/api/forms', { name: data.formName, data: [data] });
    	$location.path('/admin');
    };

    if($stateParams.id) {
    	$http.get('/api/forms/'+$stateParams.id)
    		.success(function(form) {
    			$scope.form = {};
    			$scope.form.fieldsModel = form.data[0].edaFieldsModel;
    			console.log($scope.form.fieldsModel);
		    	$scope.form.dataModel = {};

		    	$scope.form.submitFormEvent = function(dataSubmitted) {
		    		console.log("Form submitted");
		    		console.log("Here's your data: " + dataSubmitted);
		    	};

		    	$scope.form.cancelFormEvent = function() {
		    		console.log("Form cancelled!");
		    	};
    		});
    }
  });