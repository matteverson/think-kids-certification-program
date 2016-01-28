'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: String,
    activities: Array,
    assignments: Array,
    payments: Array
});

module.exports = mongoose.model('Role', RoleSchema);
