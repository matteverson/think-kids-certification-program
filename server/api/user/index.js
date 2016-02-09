'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.delete('/:id', auth.can('delete_users'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.can('create_users'), controller.create);
router.post('/:id/password_reset', controller.requestPasswordReset);
router.post('/reset_token/', controller.resetPassword);
router.post('/email_notif', controller.newEmailNotif);
router.patch('/:id', controller.update);
router.patch('/newMessage/:id', auth.isAuthenticated(), controller.newMessage);

module.exports = router;
