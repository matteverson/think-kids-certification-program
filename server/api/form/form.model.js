'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormSchema = new Schema({
  name: String,
  data: Array,
  submittedData: Array,
  roles: Array,
  classes: Array,
  isFeedback: Boolean,
  startDate: String,
  endDate: String,
  isPoll: Boolean,
});

module.exports = mongoose.model('Form', FormSchema);
