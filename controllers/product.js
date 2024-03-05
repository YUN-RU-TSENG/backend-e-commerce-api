const Product = require('../models/Product')

exports.createProduct = async (req, res) => {
    try {
        const { categoryId, subCategoryId, name } = req.body

        // 檢查分類和子分類是否存在
        const category = await Categories.findByPk(categoryId)
        const subCategory = await SubCategory.findByPk(subCategoryId)

        if (!category || !subCategory) {
            return res.status(404).json({ message: 'Category or SubCategory not found' })
        }

        // 創建產品並關聯到分類和子分類
        const product = await Product.create({ name })

        await product.setCategory(category)
        await product.setSubCategory(subCategory)

        res.status(201).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
