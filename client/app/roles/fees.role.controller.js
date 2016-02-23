'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('RoleFeesCtrl', function ($scope, $http, $location) {
    $http.get('/api/roles/')
      .success(function(roles) {
        $scope.roles = roles;

        $scope.transformChip = function(chip) {
          if(angular.isString(chip)) {
            return chip;
          }
        };

        $scope.querySearch = function(query) {
          var regexp = /[A-Za-z0-9]/g;
          var response = $scope.roles.filter(function(role) {
            return role.name.match(regexp).join('').toLowerCase().indexOf(query.match(regexp).join('').toLowerCase()) === 0;
          });
          return response;
        };
      });

    $scope.fee = {};
    $scope.showError = false;
    $scope.myDate = new Date();
    $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth(),
      $scope.myDate.getDate()+1
    );
    $scope.selectedRoleNames = [];

    $scope.setFees = function() {
      $scope.showError = true;
      if($scope.fee.description && $scope.fee.dueDate && $scope.fee.reminderDate) {

        var selectedRoleNames = $scope.selectedRoleNames.map(function(role) {
          role = role.name;
          return role;
        });

        $http.get('/api/users')
          .success(function(users) {
            $scope.users = users.filter(function(user) {
              return _.intersection(user.roles, selectedRoleNames).length > 0;
            });

            var date = moment().format();

            var announcement = {
              text: 'The payment, \'' +$scope.fee.description + '\' is due on ' + moment.unix(Date.parse($scope.fee.dueDate)/1000).format('MMMM Do YYYY'),
              read: false,
              date: date,
              recieveDate: moment($scope.fee.reminderDate).unix() * 1000
            };

            $scope.users = $scope.users.map(function(user) {
              user.announcements.push(announcement);
              return user;
            });

            for(var i = 0; i < $scope.users.length; i++) {
              $http.patch('/api/users/'+$scope.users[i]._id, $scope.users[i]);
              $http.post('/api/users/email_notif', {email: $scope.users[i].email, recieveDate: (moment($scope.fee.reminderDate).unix() * 1000) + (60 * 1000)});
            }
          });

        $location.path('/admin');
      }
    };
  });
