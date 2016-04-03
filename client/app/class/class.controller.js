'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .controller('ClassCtrl', ($scope, $stateParams, $http, Auth, Heading, $location) => {
    $http.get('/api/roles')
      .success(roles => {
        const instructorRoles = roles.filter(role => role.instructor).map(role => role.name);
        let instructors;

        $scope.isInst = Auth.getCurrentUser().roles.filter(role =>
          instructorRoles.indexOf(role) > -1
        ).length > 0;

        $http.get(`/api/classes/${$stateParams.id}`)
          .success(clas => {
            Heading.setHeading(clas.name);
            $scope.class = clas;

            $http.get('/api/users')
              .success(users => {
                instructors = users.filter(user =>
                  user.roles.filter(role =>
                    instructorRoles.indexOf(role) > -1 && role !== 'Admin'
                  ).length > 0
                ).map(user => {
                  user.inClass = false;
                  if ($scope.class.instructors.indexOf(user.name) > -1) {
                    user.inClass = true;
                  }
                  return user.name;
                });

                $scope.class.messages = $scope.class.messages.map(message => {
                  if (instructors.indexOf(message.author) > -1) {
                    message.fromInstructor = true;
                  }

                  return message;
                });
              });

            $http.get('/api/forms')
              .success(forms => {
                if ($scope.isInst) {
                  $scope.viewWelcome = true;

                  let submissions = forms.filter(form =>
                    clas.name === form.clas
                  ).map(form => {
                    const submittedData = form.submittedData.map(data => {
                      data.form = form._id;
                      data.clas = form.clas;
                      data.isPoll = form.isPoll;
                      data.name = `${form.name} - ${moment.unix(data.onTime).fromNow()}`;
                      return data;
                    });
                    return submittedData;
                  });

                  submissions = _.flatten(submissions);
                  let polls = submissions.filter(submission => submission.isPoll);
                  submissions = submissions.sort((a, b) => b.onTime - a.onTime)
                                           .filter(submission => !submission.isPoll);

                  submissions.forEach(submission => {
                    submission.fields = [];
                    const fields = Object.keys(submission);
                    fields.forEach(field => {
                      if (['byName', 'onTime', 'form', 'isPoll', 'name', 'fields']
                          .indexOf(field) < 0) {
                        submission.fields.push({ prop: field,
                                                 val: submission[field] });
                      }
                    });
                  })

                  $scope.ungradedSubmissions = submissions.filter(submission => !submission.grade);
                  $scope.gradedSubmissions = submissions.filter(submission => submission.grade);
                  const existingPolls = [];

                  polls = polls.filter(poll => {
                    if (existingPolls.indexOf(poll.form) === -1) {
                      existingPolls.push(poll.form);
                      return true;
                    }
                    return false;
                  });

                  polls.forEach(poll => {
                    if (poll.grade) {
                      $scope.gradedSubmissions.push(poll);
                    } else {
                      $scope.ungradedSubmissions.push(poll);
                    }
                  });

                  $scope.viewSubmission = (currentSubmission, index, graded) => {
                    $scope.index = null;
                    $scope.viewWelcome = false;
                    $scope.currentSubmission = currentSubmission;
                    $scope.selectedSubmission = index;
                    $scope.showSubmission = true;

                    if (graded === 'graded') {
                      $scope.submissionFields = $scope.gradedSubmissions[index].fields;
                      $scope.isUngraded = false;
                    } else {
                      $scope.submissionFields = $scope.ungradedSubmissions[index].fields;
                      $scope.isUngraded = true;
                    }

                    if (currentSubmission.isPoll) {
                      $scope.labels = [];
                      $scope.data = [[]];

                      let submittedData = $scope.forms.filter(form =>
                        form._id === currentSubmission.form
                      );

                      submittedData = submittedData[0].submittedData;

                      submittedData.forEach(submission => {
                        $scope.labels = $scope.labels.concat(Object.keys(submission))
                          .filter(label =>
                            ['onTime', 'byName', 'fields', 'form', 'isPoll', 'name',
                                           '$$hashKey', 'grade'].indexOf(label) < 0
                          )
                          .map(label => {
                            if (typeof submission[label] !== 'boolean' &&
                                       submission[label] !== undefined) {
                              label = submission[label];
                            }
                            return label;
                          });
                      });

                      $scope.labels = _.uniq(_.flatten($scope.labels));

                      submittedData.forEach(submission => {
                        const labels = Object.keys(submission)
                          .filter(label => label !== 'onTime' && label !== 'byName');

                        labels.forEach(label => {
                          if ($scope.labels.indexOf(label) > -1) {
                            if ($scope.data[0][$scope.labels.indexOf(label)]) {
                              $scope.data[0][$scope.labels.indexOf(label)] += 1;
                            } else {
                              $scope.data[0][$scope.labels.indexOf(label)] = 1;
                            }
                          } else if ($scope.labels.indexOf(submission[label]) > -1) {
                            if ($scope.data[0][$scope.labels.indexOf(submission[label])]) {
                              $scope.data[0][$scope.labels.indexOf(submission[label])] += 1;
                            } else {
                              $scope.data[0][$scope.labels.indexOf(submission[label])] = 1;
                            }
                          }
                        });
                      });
                    }
                  };

                  $scope.pass = () => {
                    $scope.currentSubmission.grade = 'Pass';
                    const submittedData = $scope.currentSubmission;
                    $http.patch(`/api/forms/${submittedData.form}`, { submittedData });
                    $location
                      .path(`/form/${submittedData.form}/data/${submittedData.onTime}/feedback`);
                  };

                  $scope.fail = () => {
                    $scope.currentSubmission.grade = 'Fail';
                    const submittedData = $scope.currentSubmission;
                    $http.patch(`/api/forms/${submittedData.form}`, { submittedData });
                    $location
                      .path(`/form/${submittedData.form}/data/${submittedData.onTime}/feedback`);
                  };
                }

                forms = forms.filter(form => {
                  if (moment().isAfter(form.endDate)) {
                    return false;
                  } else {
                    return true;
                  }
                })
                .map(form => {
                  if (form.endDate === undefined) {
                    form.endDate = moment().add(1, 'd');
                  }

                  form.unlocked = moment().isBetween(form.startDate, form.endDate);

                  return form;
                });

                $scope.forms = forms.filter(form => form.unlocked);
                $scope.disabledForms = forms.filter(form => !form.unlocked);

                if ($scope.forms.length === 0) {
                  $scope.noAssignments = true;
                }

                if ($scope.disabledForms.length > 0) {
                  $scope.viewLockedAssignments = true;
                }
              });
          });

        $scope.sendMessage = () => {
          $scope.message.author = Auth.getCurrentUser().name;

          if (instructors.indexOf($scope.message.author) > -1) {
            $scope.message.fromInstructor = true;
          }

          $scope.class.messages.push($scope.message);
          $scope.message = {};

          $http.patch(`/api/classes/${$stateParams.id}`, $scope.class)
            .success(clas => { $scope.class.__v = clas.__v; });
        };
      });
  });
