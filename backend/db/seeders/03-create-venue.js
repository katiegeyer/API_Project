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
                address: '2000 Union St',
                city: 'San Francisco',
                state: 'CA',
                lat: 37.7749,
                lng: -122.4194,
            },
            {
                groupId: 1,
                address: '601 Union St',
                city: 'San Francisco',
                state: 'CA',
                lat: 37.7749,
                lng: -122.4194,
            },
            {
                groupId: 2,
                address: '777 Airport Dr',
                city: 'Tulsa',
                state: 'OK',
                lat: 36.1539,
                lng: -95.9927,
            },
            {
                groupId: 3,
                address: 'Online',
                city: 'Remote',
                state: 'CA',
                lat: 37,
                lng: -122,
            },
            {
                groupId: 1,
                address: '1030 Hyde St',
                city: 'San Francisco',
                state: 'CA',
                lat: 37.7749,
                lng: -122.4194,
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
