const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// 要修正，正確是只有在同一 categories 中獨立
const SubCategory = sequelize.define('SubCategory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

SubCategory.associate = function (models) {
    SubCategory.belongsTo(models.Category)
    SubCategory.hasMany(models.Product)
}

module.exports = SubCategory
