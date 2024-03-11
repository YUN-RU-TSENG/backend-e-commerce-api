const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define('Order', {
  status: {
    type: DataTypes.ENUM([
      'established',
      'sorting',
      'shipping',
      'delivered',
      'completed',
      'cancelled',
    ]),
    allowNull: false,
  },
})

Order.associate = (models) => {
  Order.belongsTo(models.User)
  Order.belongsToMany(models.Variant, { through: models.OrderItem })
  Order.hasMany(models.OrderItem, { onDelete: 'CASCADE' })
}

module.exports = Order
