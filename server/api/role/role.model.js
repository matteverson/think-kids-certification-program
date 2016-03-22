'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: String,
    activities: Array,
    assignments: Array,
    instructor: Boolean
});

module.exports = mongoose.model('Role', RoleSchema);
