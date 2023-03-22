'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = 'Venues';
        return queryInterface.bulkInsert(options, [
            {
                groupId: 1,
                address: '123 Main Street',
                city: 'New York',
                state: 'NY',
                lat: 40.7128,
                lng: -74.0060,
            },
            {
                groupId: 2,
                address: '123 Main Street',
                city: 'New York',
                state: 'NY',
                lat: 40.7128,
                lng: -74.0060,
            },
            {
                groupId: 3,
                address: '123 Main Street',
                city: 'New York',
                state: 'NY',
                lat: 40.7128,
                lng: -74.0060,
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = 'Venues';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            address: { [Op.in]: ['123 Main Street', '123 Main Street', '123 Main Street'] }
        }, {});
    }
};
