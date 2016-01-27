'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: String,
    activities: String,
    assignments: String,
    payments: String
});

module.exports = mongoose.model('Role', RoleSchema);
