const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
})

Product.associate = (models) => {
  Product.belongsTo(models.Category)
  Product.belongsTo(models.SubCategory)
  Product.hasMany(models.Variant)
}

module.exports = Product
