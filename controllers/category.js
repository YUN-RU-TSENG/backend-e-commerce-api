const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Joi = require('joi')

const categorySchema = Joi.object({
    name: Joi.string().required(),
})

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
