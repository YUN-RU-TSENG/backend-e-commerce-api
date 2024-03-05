const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Category = sequelize.define('Categories', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

Category.associate = (models) => {
    Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        as: 'product',
    })

    Category.hasMany(models.SubCategory, {
        foreignKey: 'categoryId',
        as: 'subCategory',
    })
}

module.exports = Category
