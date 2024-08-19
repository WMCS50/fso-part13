const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blog', key: 'id' },
  },
  readingListId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'reading_list', key: 'id' },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'user', key: 'id' },
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership