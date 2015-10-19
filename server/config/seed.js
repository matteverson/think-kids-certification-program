/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Role = require('../api/role/role.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    roles: ['user']
  }, {
    provider: 'local',
    role: 'admin',
    roles: ['admin', 'user'],
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    name: "Test instructor",
    email: "inst@inst.com",
    password: "inst",
    roles: ['inst', 'user']
  }, function() {
      console.log('finished populating users');
    }
  );
});

Role.find({}).remove(function() {
  Role.create({
    name : 'admin',
    activities : ['view_users', 'view_forms', 'create_forms', 'delete_forms', 'delete_users', 'create_users', 'assign_users', 'track_payments','de_activate_users','reset_passwords', 'edit_role', 'add_notif', 'view_profile', 'add_class', 'edit_class']
  }, {
    name : 'user',
    activities : ['upload_doc', 'view_forms', 'fill_forms', 'make_payment','view_sub','edit_detail', 'message_user', 'view_feedback']
  }, {
    name: 'inst',
    activities: ['grade_sub', 'view_forms']
  });
});
