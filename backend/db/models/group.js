'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      //   // define association here
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'Organizer'
      })
      Group.belongsToMany(models.User, {
        through: 'Membership',
        foreignKey: 'groupId',
        otherKey: 'userId'
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        as: 'Venue'
      })
      // Group.belongsToMany(models.Venue, {
      //   through: 'Event',
      //   foreignKey: 'groupId',
      //   otherKey: 'venueId'
      // })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users'
      },
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [0, 60],
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        atLeast50(value) {
          if (value.length < 50) {
            throw new Error('About must be 50 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // createdAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    // },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    // },
  }, {
    sequelize,
    modelName: 'Group',
    onDelete: 'CASCADE'
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Group;
};

//numMembers
