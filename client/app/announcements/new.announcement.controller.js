'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newAnnouncementCtrl', function ($scope, $http, $location, $stateParams) {
    $scope.sendAnnouncement = function() {
      $http.get('/api/users')
        .success(function(users) {
          users = users.filter(function(user) {
            return user.roles.indexOf($stateParams.name) > -1;
          });

          var date = new Date();
          date = date.getDate() + '/' + date.getMonth()+1 + '/' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes();
          var announcement = {
            text: $scope.text,
            read: false,
            date: date
          };

          users = users.map(function(user) {
            user.announcements.push(announcement);
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
