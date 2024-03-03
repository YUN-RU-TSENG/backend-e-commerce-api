const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Product = sequelize.define('Product', {
    category: DataTypes.STRING,
    subcategory: DataTypes.STRING,
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
})

const Variant = sequelize.define('Variant', {
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING,
})

Product.hasMany(Variant)
Variant.belongsTo(Product)

exports.Product = Product
exports.Variant = Variant
