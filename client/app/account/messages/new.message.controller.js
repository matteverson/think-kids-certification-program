'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newMessageCtrl', function ($scope, $http, Auth, $location, User, $stateParams) {
    var allUsers;

    $http.get('/api/users')
      .success(function(users) {
        allUsers = users;
        $scope.userNames = users.map(function(user) {
          return user.name;
        });

        $('#recipient').select2();
      });

    $scope.sendMessage = function() {
      var recipient = allUsers.filter(function(user) {
        return user.name === $scope.recipient;
      });

      recipient = recipient[0];
      $scope.message.read = false;
      $scope.message.sender = { name: Auth.getCurrentUser().name, _id: Auth.getCurrentUser()._id };
      recipient.messages.push($scope.message);
      $http.patch('/api/users/newMessage/' + recipient._id, recipient);
      $location.path($stateParams.id + '/messages');
    };
  });
