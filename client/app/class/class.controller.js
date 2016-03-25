'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ClassCtrl', function ($scope, $stateParams, $http, Auth, Heading) {

    $http.get('/api/classes/' + $stateParams.id)
      .success(function (clas) {
        Heading.setHeading(clas.name);
        $scope.class = clas;
        $http.get('/api/forms')
          .success(function(forms) {
            $scope.forms = forms.filter(({ startDate, endDate, classes}) => {
              if(startDate === undefined) {
                startDate = moment();
              }

              if(endDate === undefined) {
                endDate = moment().add(1, 'd');
              }

              return classes.indexOf($scope.class.name) > -1 && moment().isBetween(startDate, endDate);
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
