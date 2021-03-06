'use strict';

var express = require('express');
var controller = require('./form.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/mine', auth.isAuthenticated(), controller.show_mine);
router.get('/:id', controller.show);
router.post('/', auth.can("create_forms"), controller.create);
router.put('/:id', auth.can("create_forms"), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', auth.can("delete_forms"), controller.destroy);

module.exports = router;
