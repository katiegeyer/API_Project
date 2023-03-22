'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = 'Events';
        return queryInterface.bulkInsert(options, [
            {
                venueId: 1,
                groupId: 1,
                name: 'Online Book Club',
                description: 'A monthly book club for book lovers who prefer to discuss their favorite books online',
                type: 'Online',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-03-27 19:00:00'),
                endDate: new Date('2023-03-27 21:00:00'),
              },
              {
                venueId: 2,
                groupId: 2,
                name: 'Online Book Club',
                description: 'A monthly book club for book lovers who prefer to discuss their favorite books online',
                type: 'Online',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-03-27 19:00:00'),
                endDate: new Date('2023-03-27 21:00:00'),
              },
              {
                venueId: 3,
                groupId: 3,
                name: 'Online Book Club',
                description: 'A monthly book club for book lovers who prefer to discuss their favorite books online',
                type: 'Online',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-03-27 19:00:00'),
                endDate: new Date('2023-03-27 21:00:00'),
              },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = 'Events';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            name: { [Op.in]: ['Online Book Club', 'Online Book Club', 'Online Book Club'] }
        }, {});
    }
};
