const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define('Order', {
    name: { type: DataTypes.STRING, allowNull: false },
})

Order.associate = (models) => {
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Variant, { through: models.OrderItem })
}

module.exports = Order
