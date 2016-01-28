  /**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/roles              ->  index
 */

'use strict';

var Role = require('./role.model.js');
var _ = require('lodash');

// Gets a list of Roles
exports.index = function(req, res) {
    Role.find(function(err, roles) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(roles);
    });
};

exports.show = function(req, res) {
    Role.findById(req.params.id, function (err, role) {
        if(err) { return handleError(res, err); }
        if(!role) { return res.status(404).send("Not Found"); }
        return res.json(role);
    });
};

exports.create = function(req, res) {
    Role.create(req.body, function(err, role) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(role);
    });
};

exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Role.findById(req.params.id, function(err, role) {
        if(err) { return handleError(res, err); }
        if(!role) { return res.status(404).send('Not Found'); }
        var updated = _.extend(role, req.body);
        updated.save(function (err) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(role);
        });
    });
};

exports.destroy = function(req, res) {
    Role.findById(function (err, role) {
        if(err) { return handleError(res, err); }
        if(!role) { return res.status(404).send('Not Found'); }
        role.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}
