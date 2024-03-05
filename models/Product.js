const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
})

Product.associate = (models) => {
    Product.belongsTo(models.Categories, {
        foreignKey: 'categoryId',
    })
    Product.belongsTo(models.SubCategory, {
        foreignKey: 'subCategoryId',
    })
}

// const Variant = sequelize.define('Variant', {
//     color: { type: DataTypes.STRING, allowNull: false },
//     size: { type: DataTypes.STRING, allowNull: false },
//     quantity: { type: DataTypes.INTEGER, allowNull: false },
//     price: { type: DataTypes.FLOAT, allowNull: false },
// })

// Product.hasMany(Variant)
// Variant.belongsTo(Product)

module.exports = Product
// exports.Product = Product
// exports.Variant = Variant
