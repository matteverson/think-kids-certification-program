'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('newMessageCtrl', function ($scope, $http, Auth, $location, User, $stateParams, Upload) {
    $scope.placeholder = "Click here to choose a file";
    $scope.startUpload = startUpload;
    $scope.readyUpload = readyUpload;
    $scope.icon_class = 'glyphicon-upload';

    $scope.policy = 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogInRoaW5rLWtpZHMtY2VydC11cGxvYWRzIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9';
    $scope.signature = '597I+rBb9xhAZcCtmPW/RhWW7rM=';

    function readyUpload(file) {
      $scope.file = file;
      $scope.placeholder = "Ready to upload";
    }

    function startUpload() {
      if (!$scope.file) {
        return undefined;
      }
      var file = $scope.file;

      Upload.upload({
        url: 'https://think-kids-cert-uploads.s3.amazonaws.com/',
        method: 'POST',
        skipAuthorization: true,
        data: {
          key: file.name, // the key to store the file on S3, could be file name or customized
          AWSAccessKeyId: 'AKIAJHXKTQJH7P4IOMDA',
          acl: 'private', // sets the access to the uploaded file in the bucket: private, public-read, ...
          policy: $scope.policy, // base64-encoded json policy (see article below)
          signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
          'Content-Type': file.type !== '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
          filename: file.name, // this is needed for Flash polyfill IE8-9
          file: file
        }
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + ' uploaded.');
        console.log(resp);
        $scope.uploadStatus = 'upload-complete';
        $scope.icon_class = 'glyphicon-ok';
        $scope.placeholder = resp.config.data.file.name;
        $scope.message.attachment = resp.config.data.file.name;
      }, function (resp) {
        console.log('Upload error');
        scope.uploadStatus = 'upload-error';
        console.log(resp);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }
    var allUsers;

    $http.get('/api/users')
      .success(function(users) {
        allUsers = users;
        $scope.userNames = users.filter(function(user) {
          return Auth.getCurrentUser()._id !== user._id;
        }).map(function(user) {
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
