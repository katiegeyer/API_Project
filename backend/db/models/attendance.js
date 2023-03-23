'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // define association here
      // Attendance.belongsTo(models.User, {
      //   foreignKey: 'userId'
      // })
      // Attendance.belongsTo(models.Event, {
      //   foreignKey: 'eventId'
      //   //as: 'numAttended'
      // })
    }
  }
  Attendance.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events'
      },
      onDelete: 'cascade'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users'
      },
      onDelete: 'cascade'
    },
    status: {
      type: DataTypes.ENUM('Attending', 'Waitlist', 'Pending'),
      allowNull: false,
      validate: {
        isIn: [['Attending', 'Waitlist', 'Pending']]
      }
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
