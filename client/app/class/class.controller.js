'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ClassCtrl', ($scope, $stateParams, $http, Auth, Heading) => {
    $http.get('/api/roles')
      .success(roles => {
        const instructorRoles = roles.filter(role => role.instructor).map(role => role.name);
        let instructors;

        $http.get(`/api/classes/${$stateParams.id}`)
          .success(clas => {
            Heading.setHeading(clas.name);
            $scope.class = clas;

            $http.get('/api/users')
              .success(users => {
                instructors = users.filter(user => {
                  return user.roles.filter(role => {
                    return instructorRoles.indexOf(role) > -1 && role !== 'Admin';
                  }).length > 0;
                }).map(user => {
                  user.inClass = false;
                  if ($scope.class.instructors.indexOf(user.name) > -1) {
                    user.inClass = true;
                  }
                  return user.name;
                });

                $scope.class.messages = $scope.class.messages.map(message => {
                  if (instructors.indexOf(message.author) > -1) {
                    message.fromInstructor = true;
                  }

                  return message;
                });

              });

            $http.get('/api/forms')
              .success(forms => {
                forms = forms.filter(form => {
                  if (moment().isAfter(form.endDate)) {
                    return false;
                  } else {
                    return true;
                  }
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

                if ($scope.disabledForms.length > 0) {
                  $scope.viewLockedAssignments = true;
                }
              });
          });

        $scope.sendMessage = () => {
          $scope.message.author = Auth.getCurrentUser().name;

          if (instructors.indexOf($scope.message.author) > -1) {
            $scope.message.fromInstructor = true;
          }

          $scope.class.messages.push($scope.message);
          $scope.message = {};

          $http.patch(`/api/classes/${$stateParams.id}`, $scope.class)
            .success(clas => { $scope.class.__v = clas.__v; })
        };
      });
  });
