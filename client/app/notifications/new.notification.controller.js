'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newNotificationCtrl', function ($scope, $http, $location, $stateParams) {
    $scope.sendNotification = function() {
      $http.get('/api/users')
        .success(function(users) {
          users = users.filter(function(user) {
            return user.roles.indexOf($stateParams.name) > -1;
          });

          var date = new Date();
          date = date.getDate() + '/' + date.getMonth()+1 + '/' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes();
          var notification = {
            text: $scope.text,
            read: false,
            date: date
          };

          users = users.map(function(user) {
            user.notifications.push(notification);
            return user;
          });

          for(var i = 0; i < users.length; i++) {
            $http.patch('/api/users/'+users[i]._id, users[i]);
          }

          $location.path('/admin');
        })
        .error(function(err) {
          if(err) {
            $location.path('/admin');
          }
        });
    };
  });
