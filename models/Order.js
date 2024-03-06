const sequelize = require('../config/database')

const Order = sequelize.define('Order', {})

Order.associate = (models) => {
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Variant, { through: models.OrderItem })
}

module.exports = Order
