'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
      Attendance.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE'
        //as: 'numAttended'
      })
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
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
      type: DataTypes.ENUM('Attending', 'Waitlist', 'Pending',),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Attendance',
    onDelete: 'CASCADE'
  });
  return Attendance;
};
