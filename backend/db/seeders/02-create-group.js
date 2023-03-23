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
        name: 'Gardening Group',
        about: 'We share tips and advice on gardening and trade seeds and plants.',
        type: 'Online',
        private: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        organizerId: 2,
        name: 'Gardening Group',
        about: 'We share tips and advice on gardening and trade seeds and plants.',
        type: 'Online',
        private: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        organizerId: 3,
        name: 'Gardening Group',
        about: 'We share tips and advice on gardening and trade seeds and plants.',
        type: 'Online',
        private: true,
        city: 'San Francisco',
        state: 'CA',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Gardening Group', 'Gardening Group', 'Gardening Group'] }
    }, {});
  }
};
