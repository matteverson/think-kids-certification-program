'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('UploadCtrl', function ($scope, Upload) {

    $scope.policy = 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogInRoaW5rLWtpZHMtY2VydC11cGxvYWRzIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9';
    $scope.signature = '597I+rBb9xhAZcCtmPW/RhWW7rM=';

    // upload later on form submit or something similar
    $scope.submit = function(form) {
      console.log(form);
      if (form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
      Upload.upload({
        url: 'https://think-kids-cert-uploads.s3.amazonaws.com/', //S3 upload url including bucket name
        method: 'POST',
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
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    // for multiple files:
    $scope.uploadFiles = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          // Upload.upload({..., data: {file: files[i]}, ...})...;
        }
        // or send them all together for HTML5 browsers:
        // Upload.upload({..., data: {file: files}, ...})...;
      }
    };
  });
