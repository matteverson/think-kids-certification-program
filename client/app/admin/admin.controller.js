'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    $http.get('/api/users')
      .success(function(users) {
        $scope.users = users.map(function(user) {
          if(user.active) {
            user.activeString = 'Deactivate';
          } else {
            user.activeString = 'Activate';
          }
          return user;
        });

        $scope.announcements = [];

        for(var i = 0; i < $scope.users.length; i++) {
          for(var x = 0; x < $scope.users[i].announcements.length; x++) {
            $scope.users[i].announcements[x].recipients = [];
            $scope.users[i].announcements[x].recipients.push($scope.users[i].name);
            $scope.announcements.push($scope.users[i].announcements[x]);
          }
        }

        for(var i = 0; i < $scope.announcements.length; i++) {
          for(var x = i+1; x < $scope.announcements.length; x) {
            if($scope.announcements[i].text === $scope.announcements[x].text) {
              $scope.announcements[i].recipients.push($scope.announcements[x].recipients[0]);
              $scope.announcements.splice(x, 1);
            } else {
              x++;
            }
          }
        }

        if($scope.announcements.length > 0) {
          $scope.sentAnnouncements = true;
        }
      });

    $scope.isAdmin = Auth.isAdmin;

    $http.get('/api/forms')
        .success(function(form) {
          $scope.forms = form;
        });

    $http.get('/api/classes')
        .success(function(classes) {
          $scope.classes = classes;
        });

    $http.get('/api/roles')
        .success(function(roles) {
          $scope.roles = roles;
        });

    $scope.toggleActivation = function(user) {
      user.active = !user.active;
      if(user.active) {
        user.activeString = 'Activate';
      } else {
        user.activeString = 'Deactivate';
      }

      $http.patch('/api/users/' + user._id, {active: user.active});
    };

    $scope.deleteUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.deleteForm = function(form) {
      $http.delete('/api/forms/' + form._id);
      angular.forEach($scope.forms, function(u, i) {
        if (u === form) {
          $scope.forms.splice(i, 1);
        }
      });
    };

    $scope.deleteClass = function(clas) {
      $http.delete('/api/classes/' + clas._id);
      angular.forEach($scope.classes, function(u, i) {
        if (u === clas) {
          $scope.classes.splice(i, 1);
        }
      });

      for(var i = 0; i < clas.students.length; i++) {
        for(var x = 0; x < $scope.users.length; x++) {
          if(clas.students[i] === $scope.users[x].name) {
            var index = $scope.users[x].classes.indexOf(clas.name);
            $scope.users[x].classes.splice(index, 1);
            $http.patch('/api/users/' + $scope.users[x]._id, $scope.users[x]);
          }
        }
      }

    };
  });
