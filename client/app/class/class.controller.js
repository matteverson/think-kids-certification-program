'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ClassCtrl', function ($scope, $stateParams, $http, Auth, Heading) {

    $http.get('/api/classes/' + $stateParams.id)
      .success(function (clas) {
        Heading.setHeading(clas.name);
        $scope.class = clas;
        $http.get('/api/forms')
          .success(function(forms) {
            forms = forms.filter(form => {
              if(moment().isAfter(form.endDate)) {
                console.log('yo');
                return false;
              } else {
                return true;
              }
            })
            .map(form => {
              if(form.endDate === undefined) {
                form.endDate = moment().add(1, 'd');
              }

              form.unlocked = moment().isBetween(form.startDate, form.endDate);

              return form;
            });

            $scope.forms = forms.filter(form => form.unlocked);
            $scope.disabledForms = forms.filter(form => !form.unlocked);

            if($scope.forms.length === 0) {
              $scope.noAssignments = true;
            }

            if($scope.disabledForms.length > 0) {
              $scope.viewLockedAssignments = true;
            }
          });
      });

    $scope.sendMessage = function() {
      $scope.message.author = Auth.getCurrentUser().name;
      $scope.class.messages.push($scope.message);
      $scope.message = {};
      $http.patch('/api/classes/'+$stateParams.id, $scope.class);
    };
  });
