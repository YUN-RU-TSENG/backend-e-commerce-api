const Product = require('../models/Product')
const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Variant = require('../models/Variant')
const Joi = require('joi')

const productSchema = Joi.object({
  categoryId: Joi.number().required(),
  subCategoryId: Joi.number().required(),
  name: Joi.string().required(),
})

exports.createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { categoryId, subCategoryId, name } = req.body

    // 檢查分類和子分類是否存在
    const category = await Category.findByPk(categoryId)
    const subCategory = await SubCategory.findByPk(subCategoryId)

    if (!category || !subCategory) {
      return res
        .status(404)
        .json({ message: 'Category or SubCategory not found' })
    }

    const existingProduct = await Product.findOne({
      where: { name, SubCategoryId: subCategoryId, CategoryId: categoryId },
    })

    if (existingProduct) {
      return res.status(400).json({ error: 'Name already exists' })
    }

    // 創建產品並關聯到分類和子分類
    const product = await Product.create({
      name,
      SubCategoryId: subCategoryId,
      CategoryId: categoryId,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: { model: Variant } })
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
