'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newClassCtrl', function ($scope, $http, $location) {
    $http.get('/api/users')
      .success(users => {
        $http.get('/api/roles')
          .success(roles => {

            roles = roles.filter(role => role.instructor || role.name === 'Admin')
                         .map(role => role.name);

            $scope.instructors = users.filter(user => {
              return user.roles.filter(role => {
                return roles.indexOf(role) > -1 && role !== 'Admin';
              }).length > 0;
            }).map(user => {
              user.inClass = false;
              return user;
            });

            $scope.users = users.filter(user => {
              return user.roles.filter(role => {
                return roles.indexOf(role) !== -1;
              }).length === 0;
            }).map(user => {
              user.inClass = false;
              return user;
            });

          });
      });

    $scope.saveClass = () => {

      const instructors = $scope.instructors.filter(instructor => instructor.inClass)
        .map(instructor => instructor.name);
      const users = $scope.users.filter(user => user.inClass);
      users.forEach(user => user.classes.push($scope.class.name));
      const userNames = users.map(user => user.name);
      const userIDs = users.map(user => user._id);

      $http.post('/api/classes', {name: $scope.class.name, instructors: instructors, students: userNames});

      for(let i = 0; i < userIDs.length; i++) {
        $http.patch('/api/users/' + userIDs[i], users[i]);
      }

      $location.path('/admin');
    };
  });
