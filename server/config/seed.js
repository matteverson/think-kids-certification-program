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
    roles: ['user'],
    prof: {
      fullName: 'Brett Cota',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    role: 'admin',
    roles: ['admin', 'user'],
    active: true,
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    prof: {
      fullName: 'Lisa Allen',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
  }, {
    provider: 'local',
    name: "Test instructor",
    email: "inst@inst.com",
    password: "inst",
    roles: ['inst', 'user'],
    prof: {
      fullName: 'Harrison Wells',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Trainer (Old)",
    email: "trainer@old.com",
    password: "trainer",
    roles: ['Certified Trainer (Old)', 'user'],
    prof: {
      fullName: 'Felicity Smoak',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Trainer (New)",
    email: "trainer@new.com",
    password: "trainer",
    roles: ['Certified Trainer (New)', 'user'],
    prof: {
      fullName: 'Oliver Queen',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Trainer Trainee (Old)",
    email: "trainee@old.com",
    password: "trainee",
    roles: ['Certified Trainer Trainee (Old)', 'user'],
    prof: {
      fullName: 'Iris West',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Trainer Trainee (New)",
    email: "trainee@new.com",
    password: "trainee",
    roles: ['Certified Trainer Trainee (new)', 'user'],
    prof: {
      fullName: 'Cisco Ramon',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  },  {
    provider: 'local',
    name: "Certified Practitioner (Old)",
    email: "practitioner@old.com",
    password: "practitioner",
    roles: ['Certified Practitioner (Old)', 'user'],
    prof: {
      fullName: 'Caitlin Snow',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Practitioner (New)",
    email: "practitioner@new.com",
    password: "practitioner",
    roles: ['Certified Practitioner (New)', 'user'],
    prof: {
      fullName: 'Barry Allen',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Practitioner Trainee (New)",
    email: "prac_trainee@old.com",
    password: "tranee",
    roles: ['Certified Pracitioner Trainee (New)', 'user'],
    prof: {
      fullName: 'Patricia Schexnayder',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  },  {
    provider: 'local',
    name: "Certified Mentor (Old)",
    email: "mentor@old.com",
    password: "mentor",
    roles: ['Certified Mentor (Old)', 'user'],
    prof: {
      fullName: 'John Smith',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Certified Mentor (New)",
    email: "mentor@new.com",
    password: "mentor",
    roles: ['Certified Mentor (New)', 'user'],
    prof: {
      fullName: 'Robert Allen',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, function() {
      console.log('finished populating users');
    }
  );
});

Role.find({}).remove(function() {
  Role.create({
    name: 'admin',
    activities : ['view_users', 'update_users', 'view_forms', 'create_forms', 'delete_forms', 'delete_users', 'create_users', 'assign_users', 'track_payments','de_activate_users','reset_passwords', 'edit_role', 'add_notif', 'view_profile', 'add_class', 'edit_class']
  }, {
    name: 'user',
    activities : ['upload_doc', 'view_forms', 'fill_forms', 'make_payment','view_sub','edit_detail', 'message_user', 'view_feedback']
  }, {
    name: 'inst',
    activities: ['grade_sub', 'view_forms']
  }, {
    name: 'Certified Trainer (Old)',
    activities: []
  }, {
    name: 'Certified Trainer (New)',
    activities: []
  }, {
    name: 'Certified Trainer Trainee (Old)',
    activities: []
  }, {
    name: 'Certified Trainer Trainee (New)',
    activities: []
  }, {
    name: 'Certified Practitioner (Old)',
    activities: []
  }, {
    name: 'Certified Practitioner (New)',
    activities: []
  }, {
    name: 'Certified Practitioner Trainee (New)',
    activities: []
  }, {
    name: 'Certified Mentor (Old)',
    activities: []
  }, {
    name: 'Certified Mentor (New)',
    activities: []
  });
});
