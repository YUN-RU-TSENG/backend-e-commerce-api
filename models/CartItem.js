const sequelize = require('../config/database')

const CartItem = sequelize.define('CartItem', {})

CartItem.associate = (models) => {}

module.exports = CartItem
