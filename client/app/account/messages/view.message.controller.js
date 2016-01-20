'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('viewMessageCtrl', function ($scope, $http, Auth, $stateParams, $location) {
    var user = Auth.getCurrentUser();

    $scope.message = user.messages.filter(function(message) {
      return message._id === $stateParams.messageID;
    })[0];

    user.messages[user.messages.indexOf($scope.message)].read = true;
    $http.patch('/api/users/' + user._id, user);

    $scope.sendMessage = function() {
      $http.get('/api/users')
        .success(function(users) {
          users = users.filter(function(user) {
            return user.name === $scope.message.sender.name;
          });

          var message = {};
          var recipient = users[0];

          message.body = $scope.message.reply;
          message.reply = '';
          message.read = false;
          message.subject = 'RE: ' + $scope.message.subject;
          message.sender = { name: Auth.getCurrentUser().name, _id: Auth.getCurrentUser()._id };
          recipient.messages.push(message);

          $http.patch('/api/users/newMessage/' + users[0]._id, recipient);
          $location.path($stateParams.id + '/messages');
        });
    };
  });
