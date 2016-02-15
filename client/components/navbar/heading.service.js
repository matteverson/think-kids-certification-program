'use strict';

angular.module('thinkKidsCertificationProgramApp')
  .factory('Heading', function Heading() {
    var heading = '';

    return {
      getHeading: function() {
        return heading;
      },

      setHeading: function(h) {
        heading = h;
      }
    };
  });
