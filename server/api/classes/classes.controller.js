'use strict';

var _ = require('lodash');
var Classes = require('./classes.model');

// Get list of classess
exports.index = function(req, res) {
  Classes.find(function (err, classess) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(classess);
  });
};

// Get a single classes
exports.show = function(req, res) {
  Classes.findById(req.params.id, function (err, classes) {
    if(err) { return handleError(res, err); }
    if(!classes) { return res.status(404).send('Not Found'); }
    return res.json(classes);
  });
};

// Creates a new classes in the DB.
exports.create = function(req, res) {
  Classes.create(req.body, function(err, classes) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(classes);
  });
};

// Updates an existing classes in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Classes.findById(req.params.id, function (err, classes) {
    if (err) { return handleError(res, err); }
    if(!classes) { return res.status(404).send('Not Found'); }
    var updated = _.extend(classes, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(classes);
    });
  });
};

// Deletes a classes from the DB.
exports.destroy = function(req, res) {
  Classes.findById(req.params.id, function (err, classes) {
    if(err) { return handleError(res, err); }
    if(!classes) { return res.status(404).send('Not Found'); }
    classes.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
