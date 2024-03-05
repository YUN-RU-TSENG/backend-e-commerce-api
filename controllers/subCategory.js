const SubCategory = require('../models/SubCategory')
const Category = require('../models/Category')
// const { Category, SubCategory } = require('../models/Category')

// 創建新的分類
exports.createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body

        const category = await Category.findByPk(categoryId)

        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }

        const subCategory = await SubCategory.create({ name, CategoryId: categoryId })

        res.status(201).json(subCategory)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// 獲取所有分類
exports.getAllSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll()
        res.status(200).json(subCategories)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
