const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.FLOAT, allowNull: false },
})

CartItem.associate = () => {}

module.exports = CartItem
