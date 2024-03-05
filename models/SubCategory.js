const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const SubCategory = sequelize.define('SubCategory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
    })
    SubCategory.hasMany(models.Product, {
        foreignKey: 'subCategoryId',
        as:'product'
    })
}

module.exports = SubCategory
