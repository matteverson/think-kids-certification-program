'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newClassCtrl', function ($scope, $http, $location) {
    $http.get('/api/users')
        .success(function(users) {
          $scope.users = users.filter(function(user) {
            return user.roles.indexOf('inst') === -1 && user.roles.indexOf('admin') === -1;
          }).map(function(user) {
            user.inClass = false;
            return user;
          });
        });

    $http.get('/api/users')
        .success(function(users) {
          $scope.instructors = users.filter(function(user) {
            return user.roles.indexOf('inst') !== -1 && user.roles.indexOf('admin') === -1;
          }).map(function(user) {
            user.inClass = false;
            return user;
          });
        });

    $scope.saveClass = function() {
      var instructors = $scope.instructors.filter(function(instructor) {
        return instructor.inClass;
      }).map(function(instructor) {
        return instructor.name;
      });

      var users = $scope.users.filter(function(user) {
        return user.inClass;
      }).map(function(user) {
        user.classes.push($scope.class.name);
        return user;
      });

      var userNames = users.map(function(user) {
        return user.name;
      });

      var userIDs = users.map(function(user) {
        return user._id;
      });

      $http.post('/api/classes', {name: $scope.class.name, instructors: instructors, students: userNames});

      for(var i = 0; i < userIDs.length; i++) {
        $http.patch('/api/users/' + userIDs[i], users[i]);
      }

      $location.path('/admin');
    };
  });
