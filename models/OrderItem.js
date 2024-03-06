const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.FLOAT, allowNull: false },
})

OrderItem.associate = () => {}

module.exports = OrderItem
