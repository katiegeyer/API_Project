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
                url: 'https://images.getbento.com/accounts/f98729c63b39c842a49cbcabeac52fa6/media/images/97209Wildseed_blue.png',
                preview: true
            },
            {
                eventId: 2,
                url: 'https://www.nourishcafesf.com/wp-content/uploads/2014/10/HeaderLogo.png',
                preview: true
            },
            {
                eventId: 3,
                url: 'https://www.airport-tulsa.com/images/tulsa-airport-terminal.jpg',
                preview: true
            },
            {
                eventId: 4,
                url: 'https://www.astrologyzone.com/wp-content/uploads/2016/04/az_mercuryretro.jpg',
                preview: true
            },
            {
                eventId: 5,
                url: 'https://www.astrologyzone.com/wp-content/uploads/2016/04/az_mercuryretro.jpg',
                preview: true
            },
            {
                eventId: 6,
                url: 'https://www.airport-tulsa.com/images/tulsa-airport-terminal.jpg',
                preview: true
            },
            {
                eventId: 7,
                url: 'https://www.airport-tulsa.com/images/tulsa-airport-terminal.jpg',
                preview: true
            },
            {
                eventId: 8,
                url: 'https://originaljoes.com/wp-content/uploads/2019/10/OJs_logo_BLK_X_top_REV2_SMALL.png?x53265',
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
