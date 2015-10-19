'use strict';

var express = require('express');
var controller = require('./form.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.can("view_forms"), controller.index);
router.get('/:id', auth.can("view_forms"), controller.show);
router.post('/', auth.can("create_forms"), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', auth.can("delete_forms"), controller.destroy);

module.exports = router;