'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('FormCtrl', function ($scope, $http, $stateParams, $location, Auth) {
    $scope.viewForm = false;

    $scope.saveForm = function(data) {
        $http.post('/api/forms', { name: data.formName, data: [data], roles: []}).success(function(form) {
            $location.path("/form/" + form._id + "/roles");
        });
    };

    if($stateParams.formID) {
        $http.get('/api/roles')
            .success(function(roles) {
                $http.get('/api/forms/' + $stateParams.formID)
                    .success(function(form) {
                        $scope.roles = roles.map(function(role) {
                            if(form.roles.indexOf(role.name) !== -1) {
                                role.permitted = true;
                            } else {
                                role.permitted = false;   
                            }
                            return role;
                        });
                        $scope.roles = $scope.roles.splice(3, $scope.roles.length-3);
                    })
            });
        
        $scope.saveRoles = function(data) {
            var roles = data.filter(function(role) {
                return role.permitted === true;
            }).map(function(role) {
                return role.name;
            });
            
            $http.patch('/api/forms/'+$stateParams.formID, {roles: roles})
                .success(function(form) {
                   location.path("/admin");
                });
         };  
    }

    if($stateParams.id) {
        $scope.viewForm = true;
        
        $http.get('/api/forms/'+$stateParams.id)
            .success(function(form) {
        
                var permitted = form.roles.filter(function(role) {
                    return Auth.getCurrentUser().roles.indexOf(role) !== -1;
                }).length;
        
                if(permitted == 0) {
                    $location.path("/");
                } else {
                    $scope.form = {};
                    $scope.form.btnSubmitText = form.data[0].btnSubmitText;
                    $scope.form.btnCancelText = form.data[0].btnCancelText;
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
