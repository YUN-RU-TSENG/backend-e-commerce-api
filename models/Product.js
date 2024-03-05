const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Product = sequelize.define('Product', {
    category: { type: DataTypes.STRING, allowNull: false },
    subcategory: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
})

const Variant = sequelize.define('Variant', {
    color: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
})

Product.hasMany(Variant)
Variant.belongsTo(Product)

exports.Product = Product
exports.Variant = Variant
