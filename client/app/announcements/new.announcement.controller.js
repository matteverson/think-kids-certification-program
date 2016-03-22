'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newAnnouncementCtrl', function ($scope, $http, $location) {
    $http.get('/api/roles')
      .success(roles => {
        $scope.roles = roles.map(role => {
          if(role.name === 'user') {
            role.name = 'All users';
          }

          return role;
        });
      });

    $scope.sendAnnouncement = function() {
      $http.get('/api/users')
        .success(users => {
          var roles = $scope.roles.map(function(role) {
            if(role.name === 'All users') {
              role.name = 'user';
            }
            return role;
          }).filter(role => role.selected);

          users = users.filter(function(user) {
            var common = roles.filter(function(role) {
              return user.roles.indexOf(role.name) > -1;
            });

            if(common.length > 0) {
              return true;
            }
            return false;
          });

          var date = moment().format();
          var announcement = {
            text: $scope.text,
            read: false,
            date: date,
            recieveDate: Date.now()
          };

          users = users.map(function(user) {
            user.announcements.push(announcement);
            return user;
          });

          for(var i = 0; i < users.length; i++) {
            $http.patch('/api/users/'+users[i]._id, users[i]);
            $http.post('/api/users/email_notif', {email: users[i].email, recieveDate: Date.now() + (60 * 1000)});
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
