'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClassesSchema = new Schema({
  name: String,
  instructors: [String],
  students: [String],
  messages: []
});

module.exports = mongoose.model('Classes', ClassesSchema);
