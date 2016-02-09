'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newAnnouncementCtrl', function ($scope, $http, $location) {
    $http.get('/api/roles')
      .success(function(roles) {
        $scope.roles = roles.map(function(role) {
          if(role.name === 'admin') {
            role.name = 'Admin';
          } else if(role.name === 'user') {
            role.name = 'All users';
          } else if(role.name === 'inst') {
            role.name = 'Instructors';
          }
          return role;
        });
      });

    $scope.sendAnnouncement = function() {
      $http.get('/api/users')
        .success(function(users) {
          var roles = $scope.roles.map(function(role) {
            if(role.name === 'Admin') {
              role.name = 'admin';
            } else if(role.name === 'All users') {
              role.name = 'user';
            } else if(role.name === 'Instructors') {
              role.name = 'inst';
            }
            return role;
          }).filter(function(role) {
            return role.selected;
          });

          users = users.filter(function(user) {
            var common = roles.filter(function(role) {
              return user.roles.indexOf(role.name) > -1;
            });

            if(common.length > 0) {
              return true;
            }
            return false;
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
