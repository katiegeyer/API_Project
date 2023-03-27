'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE'
      })
      Membership.belongsTo(models.Group, {
        foreignKey: 'id',
        onDelete: 'CASCADE'
      })
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users'
      },
      onDelete: 'cascade'
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups'
      },
      onDelete: 'cascade'
    },
    status: {
      type: DataTypes.ENUM('Organizer(host)', 'Co-host', 'Member', 'Pending'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Membership',
    onDelete: 'CASCADE',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Membership;
};
