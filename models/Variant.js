const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Variant = sequelize.define('Variant', {
    color: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
})

Variant.associate = (models) => {
    Variant.belongsTo(models.Product)
    Variant.belongsToMany(models.Cart, { through: models.CartItem })
    Variant.belongsToMany(models.Order, { through: models.OrderItem })
}

module.exports = Variant
