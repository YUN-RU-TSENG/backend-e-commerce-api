// models/Cart.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { Product, Variant } = require('./Product')
const User = require('./User')

const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

Cart.belongsTo(Product)
Cart.belongsTo(Variant)
Cart.belongsTo(User)

module.exports = Cart
