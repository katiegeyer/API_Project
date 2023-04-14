'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = 'GroupImages';
        return queryInterface.bulkInsert(options, [
            {
                groupId: 1,
                url: 'https://static.boredpanda.com/blog/wp-content/uploads/2019/12/guy-protesting-randon-things-dudewithsign-1-13-5df09bdd2244f__700.jpg',
                preview: true
            },
            {
                groupId: 2,
                url: 'https://www.boredpanda.com/blog/wp-content/uploads/2019/12/guy-protesting-randon-things-dudewithsign-1-1-5df09bc654fb1__700.jpg',
                preview: true
            },
            {
                groupId: 3,
                url: 'https://static.boredpanda.com/blog/wp-content/uploads/2019/12/guy-protesting-randon-things-dudewithsign-1-10-5df09bd70fa89__700.jpg',
                preview: true
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = 'GroupImages';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            url: { [Op.in]: ['url1.com', 'url2.com', 'url3.com'] }
        }, {});
    }
};
