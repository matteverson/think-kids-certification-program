'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('editClassCtrl', function ($scope, $http, $location, $stateParams) {
    $http.get('/api/classes/'+$stateParams.id)
      .success(function(clas) {
        $scope.class = clas;

        $http.get('/api/users')
            .success(function(users) {
              $scope.users = users.filter(function(user) {
                return user.roles.indexOf('inst') === -1 && user.roles.indexOf('admin') === -1;
              }).map(function(user) {
                user.inClass = false;
                if($scope.class.students.indexOf(user.name) > -1) {
                  user.inClass = true;
                }
                return user;
              });
            });

        $http.get('/api/users')
            .success(function(users) {
              $scope.instructors = users.filter(function(user) {
                return user.roles.indexOf('inst') !== -1 && user.roles.indexOf('admin') === -1;
              }).map(function(user) {
                user.inClass = false;
                if($scope.class.instructors.indexOf(user.name) > -1) {
                  user.inClass = true;
                }
                return user;
              });
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

      $http.patch('/api/classes/'+$scope.class._id, {name: $scope.class.name, instructors: instructors, students: userNames});

      for(var i = 0; i < userIDs.length; i++) {
        $http.patch('/api/users/' + userIDs[i], users[i]);
      }

      $location.path('/admin');
    };
  });
