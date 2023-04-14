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
                name: 'Stop the Salad Madness',
                description: 'We are going after Wildseed and their 17 dollar salad.',
                type: 'In-person',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-04-05 15:00:00'),
                endDate: new Date('2023-04-05 18:00:00'),
            },
            {
                venueId: 2,
                groupId: 1,
                name: 'We Can Make Our Own For Less',
                description: 'There is nothing nourishing about a 20 dollar salad from Nourish.',
                type: 'In-person',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-05-25 15:00:00'),
                endDate: new Date('2023-05-25 18:00:00'),
            },
            {
                venueId: 3,
                groupId: 2,
                name: 'Tulsa TSA monthly',
                description: 'A monthly protest at the Tulsa Airport TSA Gate 2.',
                type: 'In-person',
                capacity: 50,
                price: 15.00,
                startDate: new Date('2023-05-02 10:00:00'),
                endDate: new Date('2023-05-02 20:00:00'),
            },
            {
                venueId: 4,
                groupId: 3,
                name: 'Teaching others about Mercury',
                description: 'This protest will teach astrologers that Mercury in Retrograde is a myth.',
                type: 'Online',
                capacity: 100,
                price: 0.00,
                startDate: new Date('2023-05-20 19:00:00'),
                endDate: new Date('2023-05-20 21:00:00'),
            },
            {
                venueId: 4,
                groupId: 3,
                name: 'Trolling others about Mercury',
                description: 'This protest will troll astrologers about their stupid ideas.',
                type: 'Online',
                capacity: 100,
                price: 0.00,
                startDate: new Date('2023-05-27 19:00:00'),
                endDate: new Date('2023-05-27 21:00:00'),
            },
            {
                venueId: 3,
                groupId: 2,
                name: 'Tulsa TSA monthly',
                description: 'A monthly protest at the Tulsa Airport TSA Gate 2.',
                type: 'In-person',
                capacity: 50,
                price: 15.00,
                startDate: new Date('2023-06-02 10:00:00'),
                endDate: new Date('2023-06-02 20:00:00'),
            },
            {
                venueId: 3,
                groupId: 2,
                name: 'Tulsa TSA monthly',
                description: 'A monthly protest at the Tulsa Airport TSA Gate 2.',
                type: 'In-person',
                capacity: 50,
                price: 15.00,
                startDate: new Date('2023-07-02 10:00:00'),
                endDate: new Date('2023-07-02 20:00:00'),
            },
            {
                venueId: 5,
                groupId: 1,
                name: 'Give Me Cheap Greens Now!',
                description: 'We are going after Original Joes and their overpriced Cobb.',
                type: 'In-person',
                capacity: 50,
                price: 0.00,
                startDate: new Date('2023-06-22 15:00:00'),
                endDate: new Date('2023-06-22 18:00:00'),
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
