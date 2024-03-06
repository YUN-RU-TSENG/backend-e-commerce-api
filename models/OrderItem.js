const sequelize = require('../config/database')

const OrderItem = sequelize.define('OrderItem', {})

OrderItem.associate = (models) => {}

module.exports = OrderItem
