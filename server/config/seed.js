/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Role = require('../api/role/role.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Brett Cota',
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
    roles: ['Admin', 'user'],
    active: true,
    name: 'Lisa Allen',
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
    roles: ['Admin', 'user'],
    active: true,
    name: 'Aniruddh Agarwal',
    email: 'aaniruddh99@gmail.com',
    password: 'admin',
    prof: {
      fullName: 'Aniruddh Agarwal',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
  }, {
    provider: 'local',
    name: "Harrison Wells",
    email: "inst@inst.com",
    password: "inst",
    roles: ['Instructor', 'user'],
    prof: {
      fullName: 'Harrison Wells',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Cassie Hanna",
    email: "trainer@old.com",
    password: "trainer",
    roles: ['Certified Trainer (Old)', 'user'],
    prof: {
      fullName: 'Cassie Hanna',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Raul Wilder",
    email: "trainer@new.com",
    password: "trainer",
    roles: ['Certified Trainer (New)', 'user'],
    prof: {
      fullName: 'Raul Wilder',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Iris West",
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
    name: "Cisco Ramon",
    email: "trainee@new.com",
    password: "trainee",
    roles: ['Certified Trainer Trainee (New)', 'user'],
    prof: {
      fullName: 'Cisco Ramon',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      location: 'Atlantis'
    },
    active: true
  },  {
    provider: 'local',
    name: "Miriam Bryant",
    email: "practitioner@old.com",
    password: "practitioner",
    roles: ['Certified Practitioner (Old)', 'user'],
    prof: {
      fullName: 'Miriam Bryant',
      avatar: 'http://www.lessuk.org/downloads/Photos/Staff-Photos/No_picture_icon_2.jpg',
      bio: 'I’m a marketing manager with 10 years of experience in both web and traditional advertising, promotions, events, and campaigns. I have worked on integrated campaigns for major clients such as Etrade, Bank of America, Sony Music, and Microsoft and have been recognized with several awards during my career.',
      gender: 'Female',
      location: 'Atlantis'
    },
    active: true
  }, {
    provider: 'local',
    name: "Barry Allen",
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
    name: "Patricia Schexnayder",
    email: "prac_trainee@old.com",
    password: "tranee",
    roles: ['Certified Practitioner Trainee (New)', 'user'],
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
    name: "John Smith",
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
    name: "Robert Allen",
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
    name: 'Admin',
    activities : ['view_users', 'update_users', 'view_forms', 'create_forms', 'delete_forms', 'delete_users', 'create_users', 'assign_users', 'track_payments','de_activate_users','reset_passwords', 'edit_role', 'add_notif', 'view_profile', 'add_class', 'edit_class']
  }, {
    name: 'user',
    activities : ['upload_doc', 'view_forms', 'fill_forms', 'make_payment','view_sub','edit_detail', 'message_user', 'view_feedback']
  }, {
    name: 'Instructor',
    instructor: true,
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
