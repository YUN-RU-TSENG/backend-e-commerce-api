// const { Category, SubCategory } = require('../models/Category')
const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')

// 創建新的分類
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await Category.create({ name })
        res.status(201).json(category)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// 獲取所有分類
exports.getAllCategory = async (req, res) => {
    try {
        const categories = await Category.findAll({ include: { model: SubCategory } })
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
