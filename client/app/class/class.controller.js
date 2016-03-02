'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ClassCtrl', function ($scope, $stateParams, $http, Auth) {

    $http.get('/api/classes/' + $stateParams.id)
      .success(function (clas) {
        $scope.class = clas;
        $http.get('/api/forms')
          .success(function(forms) {
            $scope.forms = forms.filter(function(form) {
              return form.classes.indexOf($scope.class.name) > -1;
            });
          });
      });

    $scope.sendMessage = function() {
      $scope.message.author = Auth.getCurrentUser().name;
      $scope.class.messages.push($scope.message);
      $scope.message = {};
      $http.patch('/api/classes/'+$stateParams.id, $scope.class);
    };
  });
