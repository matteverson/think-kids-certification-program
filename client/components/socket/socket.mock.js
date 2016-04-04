'use strict';

angular.module('thinkKidsCertificationProgramApp', [])
  .factory('socket', () => {
    return {
      socket: {
        connect() {},
        on() {},
        emit() {},
        receive() {},
      },

      syncUpdates() {},
      unsyncUpdates() {},
    };
  });
