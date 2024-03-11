const Variant = require('../models/Variant')
const Product = require('../models/Product')
const Joi = require('joi')

const variantSchema = Joi.object({
  productId: Joi.number().required(),
  color: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
})

const updateVariantSchema = Joi.object({
  color: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
})

exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.findAll()
    res.json(variants)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
exports.getVariant = async (req, res) => {
  try {
    const variantId = req.params.id
    const existingVariant = await Variant.findOne({
      where: { id: variantId },
      include: [{ model: Product }],
    })

    if (!existingVariant) {
      res.status(400).json({ message: 'Variant not found' })
    }

    res.status(200).json(existingVariant)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createVariant = async (req, res) => {
  try {
    const { error } = variantSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { productId, color, size, quantity, price } = req.body

    const product = await Product.findByPk(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const existingVariant = await Variant.findOne({
      where: { color, size, ProductId: productId },
    })

    if (existingVariant) {
      return res.status(400).json({ error: 'Variant already exists' })
    }

    const variant = await Variant.create({
      ProductId: productId,
      color,
      size,
      quantity,
      price,
    })

    res.status(201).json(variant)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateVariant = async (req, res) => {
  try {
    const { error } = updateVariantSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { color, size, price, quantity } = req.body
    const variantId = req.params.id

    const existingVariant = await Variant.findByPk(variantId)

    if (!existingVariant) {
      return res.status(400).json({ error: 'Variant not found' })
    }

    existingVariant.color = color
    existingVariant.size = size
    existingVariant.price = price
    existingVariant.quantity = quantity

    await existingVariant.save()
    res.status(200).json(existingVariant)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteVariant = async (req, res) => {
  try {
    const variantId = req.params.id
    const existingVariant = await Variant.findByPk(variantId)

    if (!existingVariant) {
      return res.status(400).json({ message: 'Variant not found' })
    }

    await existingVariant.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
