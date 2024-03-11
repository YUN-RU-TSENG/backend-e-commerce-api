const SubCategory = require('../models/SubCategory')
const Category = require('../models/Category')
const Joi = require('joi')

const subCategorySchema = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.number().required(),
})

const updateSubCategorySchema = Joi.object({
  name: Joi.string().required(),
})

exports.getAllSubCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll()
    res.status(200).json(subCategories)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createSubCategory = async (req, res) => {
  try {
    const { error } = subCategorySchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name, categoryId } = req.body

    const category = await Category.findByPk(categoryId)

    if (!category) {
      return res.status(404).json({ message: 'SubCategory not found' })
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
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateSubCategory = async (req, res) => {
  try {
    const { error } = updateSubCategorySchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name } = req.body
    const subCategoryId = req.params.id

    const existingSubCategory = await SubCategory.findByPk(subCategoryId)
    if (!existingSubCategory) {
      return res.status(400).json({ error: 'SubCategory not found' })
    }

    existingSubCategory.name = name
    await existingSubCategory.save()

    res.status(201).json(existingSubCategory)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id
    const existingSubCategory = await SubCategory.findByPk(subCategoryId)

    if (!existingSubCategory) {
      return res.status(400).json({ message: 'SubCategory not found' })
    }

    await existingSubCategory.destroy()

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
