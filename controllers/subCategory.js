const SubCategory = require('../models/SubCategory')
const Category = require('../models/Category')
const Joi = require('joi')

const subCategorySchema = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.number().required(),
})

exports.createSubCategory = async (req, res) => {
  try {
    const { error } = subCategorySchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name, categoryId } = req.body

    const category = await Category.findByPk(categoryId)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const existingSubCategory = await SubCategory.findOne({
      where: { name, CategoryId: categoryId },
    })

    if (existingSubCategory) {
      return res.status(400).json({ error: 'Name already exists' })
    }

    const subCategory = await SubCategory.create({
      name,
      CategoryId: categoryId,
    })

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
