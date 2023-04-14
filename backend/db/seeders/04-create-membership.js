'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = 'Memberships';
        return queryInterface.bulkInsert(options, [
            {
                userId: 1,
                groupId: 1,
                status: 'Organizer(host)',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 2,
                groupId: 2,
                status: 'Co-host',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 3,
                groupId: 3,
                status: 'Organizer(host)',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = 'Memberships';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            userId: { [Op.in]: [1, 2, 3] }
        }, {});
    }
};
