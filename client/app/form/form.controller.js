'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function ($scope, $http, $stateParams, $location, Auth) {
    $http.get('/api/roles')
        .success(function(roles) {
            $scope.roles = roles.map(function(role) {
                role.permitted = false;
                return role;
            });
        });
    
    $scope.saveForm = function(data) {
        var roles = $scope.$$childHead.roles.filter(function(role) {
            return role.permitted === true;
        }).map(function(role) {
            return role.name;
        });
    	
        $http.post('/api/forms', { name: data.formName, data: [data], roles: roles });
    	$location.path('/admin');
    };

    if($stateParams.id) {
    	$http.get('/api/forms/'+$stateParams.id)
    		.success(function(form) {

                var permitted = form.roles.filter(function(role) {
                    return Auth.getCurrentUser().roles.indexOf(role) !== -1;
                }).length;

                if(permitted == 0) {
                    $location.path("/");
                } else {
                    $scope.form = {};
                    $scope.form.fieldsModel = form.data[0].edaFieldsModel;
                    $scope.form.dataModel = {};

                    $scope.form.submitFormEvent = function(dataSubmitted) {
                        console.log("Form submitted");
                        console.log("Here's your data: " + dataSubmitted);
                    };

                    $scope.form.cancelFormEvent = function() {
                        console.log("Form cancelled!");
                    };
                }
    		});
    }
  });