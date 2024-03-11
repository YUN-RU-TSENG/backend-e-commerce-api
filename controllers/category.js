const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Joi = require('joi')

const categorySchema = Joi.object({
  name: Joi.string().required(),
})

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: { model: SubCategory },
    })

    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name } = req.body
    const existingCategory = await Category.findOne({ where: { name } })

    if (existingCategory) {
      return res.status(400).json({ error: 'Name already exists' })
    }

    const category = await Category.create({ name })

    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name } = req.body
    const categoryId = req.params.id
    const existingCategory = await Category.findByPk(categoryId)

    if (!existingCategory) {
      return res.status(400).json({ error: 'Name not found' })
    }

    existingCategory.name = name
    await existingCategory.save()

    res.status(200).json(existingCategory)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id
    const existingCategory = await Category.findByPk(categoryId)

    if (!existingCategory) {
      return res.status(400).json({ message: 'Name not found' })
    }

    await existingCategory.destroy()

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
