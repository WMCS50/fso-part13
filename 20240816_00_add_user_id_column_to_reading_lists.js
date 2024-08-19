const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('reading_lists', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    })
  },

  down: async ({ context: queryInterface}) => {
    await queryInterface.removeColumn('reading_lists', 'user_id')
  }
}