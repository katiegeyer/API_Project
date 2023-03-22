'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = 'EventImages';
        return queryInterface.bulkInsert(options, [
            {
                eventId: 1,
                url: 'url1.com',
                preview: true
            },
            {
                eventId: 2,
                url: 'url2.com',
                preview: true
            },
            {
                eventId: 3,
                url: 'url3.com',
                preview: true
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = 'EventImages';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            url: { [Op.in]: ['url1.com', 'url2.com', 'url3.com'] }
        }, {});
    }
};
