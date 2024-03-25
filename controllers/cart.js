const Variant = require('../models/Variant')
const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')
const Product = require('../models/Product')
const User = require('../models/User')
const Joi = require('joi')

const cartSchema = Joi.object({
  variantId: Joi.number().required(),
  quantity: Joi.number().required(),
})

const deleteCartSchema = Joi.object({
  variantId: Joi.number().required(),
})

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId

    const [userCart] = await Cart.findOrCreate({
      where: { UserId: userId },
      include: [
        {
          model: Variant,
          through: { attributes: ['quantity'] },
          include: [
            {
              model: Product,
              attributes: ['name', 'image'],
            },
          ],
        },
      ],
    })

    res.json(userCart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getAllCarts = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Cart,
          include: [
            {
              model: Variant,
              through: { attributes: ['quantity'] },
              include: [
                {
                  model: Product,
                  attributes: ['name', 'image'],
                },
              ],
            },
          ],
        },
      ],
    })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.addToCart = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { variantId, quantity } = req.body

    const userId = req.user.userId

    const variant = await Variant.findByPk(variantId)
    const product = await Product.findByPk(variant.ProductId)

    if (!variant) {
      return res.status(400).json({ message: 'Variant not found' })
    }

    if (!product) {
      return res.status(400).json({ message: 'Product not found' })
    }

    if (variant.quantity < quantity) {
      return res.status(400).json({ message: 'Variant quantity not enough' })
    }

    const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

    const existingCartItem = await CartItem.findOne({
      where: {
        VariantId: variantId,
        CartId: userCart.id,
      },
    })

    if (existingCartItem) {
      existingCartItem.quantity += quantity
      await existingCartItem.save()
      res.status(200).json(existingCartItem)
    }

    const cartItem = await CartItem.create({
      VariantId: variantId,
      CartId: userCart.id,
      quantity,
    })

    res.status(201).json(cartItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateCartItem = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { variantId, quantity } = req.body

    const userId = req.user.userId
    const variant = await Variant.findByPk(variantId)

    if (!variant) {
      return res.status(400).json({ message: 'Variant not found' })
    }

    if (variant.quantity < quantity) {
      return res.status(400).json({ message: 'Variant quantity not enough' })
    }

    const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

    const existingCartItem = await CartItem.findOne({
      where: {
        VariantId: variantId,
        CartId: userCart.id,
      },
    })

    if (!existingCartItem) {
      res.status(400).json({ message: 'CartItem not found' })
    }

    existingCartItem.quantity = quantity
    await existingCartItem.save()

    res.status(200).json(existingCartItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteCartItem = async (req, res) => {
  try {
    const { error } = deleteCartSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const userId = req.user.userId
    const { variantId } = req.body

    const variant = await Variant.findByPk(variantId)

    if (!variant) {
      return res.status(400).json({ message: 'Variant not found' })
    }

    const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

    const existingCartItem = await CartItem.findOne({
      where: {
        VariantId: variantId,
        CartId: userCart.id,
      },
    })

    if (!existingCartItem) {
      res.status(404).json({ message: 'CartItem not found' })
    }
    await existingCartItem.destroy()

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
