'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Stop Expensive Salads',
        about: 'We protest against the rising prices of salads.  If you feel strongly that a bowl of lettuce and vegetables should cost less than the current prices, this is a protest for you.  We will be standing in front of various local restaurants, shouting and holding signs.  Lunch will not be provided.',
        type: 'In person',
        private: false,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        organizerId: 2,
        name: 'Those against Standing When The Plane Lands',
        about: 'We feel very strongly against those passengers who stand as soon as the plane lands, blocking those seated in front of them, crowding the aisle as to get off the plane earlier than everyone else.  We will be protesting against this in front of TSA at the local aiport.  Our events are not free, all funds go towards purchasing tickets for all group members in order to protest on an actual flight.',
        type: 'In person',
        private: false,
        city: 'Tulsa',
        state: 'OK',
      },
      {
        organizerId: 3,
        name: 'Mercury Is Not in Retrograde',
        about: 'We are here to protest Mercury in Retrograde.  We are sickened by the excuses and lies about technology and communication breakdown, blaming Mercury while it is clearly personal problems.  Leave Mercury out of your issues, Mercury did nothing wrong.  We will mainly be meeting on Zoom to vent, and trolling popular astrology forums.',
        type: 'Online',
        private: true,
        city: 'Remote',
        state: 'Remote',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Against Expensive Salads', 'Gardening Group', 'Gardening Group'] }
    }, {});
  }
};
