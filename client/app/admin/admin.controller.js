'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, $mdDialog, $mdToast, $timeout) {
    $timeout(function() {
      $http.get('/api/users')
        .success(function(users) {
          $scope.users = users.map(function(user) {
            if(user.active) {
              user.activeClass = '';
              user.activeString = 'Deactivate';
            } else {
              user.activeClass = 'disabled';
              user.activeString = 'Activate';
            }
            return user;
          }).sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });

          $scope.announcements = [];

          for(var i = 0; i < $scope.users.length; i++) {
            for(var x = 0; x < $scope.users[i].announcements.length; x++) {
              $scope.users[i].announcements[x].recipients = [];
              $scope.users[i].announcements[x].recipients.push($scope.users[i].name);
              $scope.announcements.push($scope.users[i].announcements[x]);
            }
          }

          for(var n = 0; n < $scope.announcements.length; n++) {
            for(var y = n+1; y < $scope.announcements.length; y) {
              if($scope.announcements[n].text === $scope.announcements[y].text) {
                $scope.announcements[n].recipients.push($scope.announcements[y].recipients[0]);
                $scope.announcements.splice(y, 1);
              } else {
                y++;
              }
            }
          }

          if($scope.announcements.length > 0) {
            $scope.sentAnnouncements = true;
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

    $http.get('/api/roles')
      .success(function(roles) {
        $scope.roles = roles;
      });

    $scope.showToast = function(toastText) {
      var toast = $mdToast.simple()
            .textContent(toastText)
            .action('OK')
            .highlightAction('false')
            .position('bottom right');

      $mdToast.show(toast);
    };

    $scope.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    $scope.paidStr = function(payment) {
      if(payment.paid) {
        return 'Paid';
      } else {
        return 'Unpaid';
      }
    };

    $scope.searchUser = function(userName) {
      return $scope.users.filter(function(user) {
        return angular.lowercase(user.name).indexOf(angular.lowercase(userName)) > -1;
      });
    };

    $scope.pay = function(user) {
      $timeout(function() {
        $http.patch('/api/users/'+user._id, user)
        .success(function(updatedUser) {
          user.__v = updatedUser.__v;
        });
      });
    };

    $scope.toggleActivation = function(user, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to ' + user.activeString.toLowerCase() + ' the account?')
        .textContent('')
        .ariaLabel(user.activeString)
        .targetEvent(ev)
        .ok('Yes')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        user.active = !user.active;
        $scope.showToast('Account ' + user.activeString.toLowerCase() + 'd.');
        if(user.active) {
          user.activeClass = '';
          user.activeString = 'Deactivate';
        } else {
          user.activeClass = 'disabled';
          user.activeString = 'Activate';
        }

        $http.patch('/api/users/' + user._id, {active: user.active});
      });
    };

    $scope.deleteUser = function(user, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete the account?')
        .textContent('This action is irreversible.')
        .ariaLabel('Delete account')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        User.remove({ id: user._id });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
        $scope.showToast('Account deleted.');
      });
    };

    $scope.deleteForm = function(form, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete the form?')
        .textContent('This action is irreversible.')
        .ariaLabel('Delete form')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        $http.delete('/api/forms/' + form._id);
        angular.forEach($scope.forms, function(u, i) {
          if (u === form) {
            $scope.forms.splice(i, 1);
          }
        });
        $scope.showToast('Form deleted.');
      });
    };

    $scope.deleteClass = function(clas, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete the class?')
        .textContent('This action is irreversible.')
        .ariaLabel('Delete class')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
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

        $scope.showToast('Class deleted.');
      });
    };
  });
