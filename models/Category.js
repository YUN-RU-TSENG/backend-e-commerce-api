const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
})

Category.associate = function (models) {
  Category.hasMany(models.SubCategory)
  Category.hasMany(models.Product)
}

module.exports = Category
