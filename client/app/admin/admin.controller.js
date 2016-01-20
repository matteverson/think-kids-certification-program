'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query(function(users) {
      users = users.map(function(user) {
        if(user.active) {
          user.activeString = 'Deactivate';
        } else {
          user.activeString = 'Activate';
        }
      });
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
