'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })
      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId'
      })
      Event.belongsToMany(models.User, {
        through: 'Attendance',
        foriengKey: 'eventId',
        otherKey: 'userId'
      })
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venues'
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups'
      },
      onDelete: 'cascade'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(6, 2)
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        // isBeforeEnd: function (value) {
        //   if (new Date(value).toDateString() >= new Date(this.endDate.toDateString())) {
        //     throw new Error('Start date must be before end date');
        //   }
        // },
        isFutureDate: function (value) {
          const currentDate = new Date();
          if (new Date(value).toDateString() <= currentDate.toDateString()) {
            throw new Error('Start date must be in the future');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStart: function (value) {
          if (new Date(value).toDateString() <= new Date(this.startDate).toDateString()) {
            throw new Error('End date is less than start date');
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};

//numAttending
