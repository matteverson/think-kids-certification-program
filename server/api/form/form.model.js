'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormSchema = new Schema({
  name: String,
  data: Array
});

module.exports = mongoose.model('Form', FormSchema);