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

    const responseData = {
      id: userCart.id,
      createdAt: userCart.createdAt,
      updatedAt: userCart.updatedAt,
      UserId: userCart.UserId,
      cartItems: userCart.Variants,
    }

    res.json(responseData)
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

    const variant = await Variant.findByPk(variantId, {
      include: [
        {
          model: Product,
          attributes: ['name', 'image'],
        },
      ],
    })

    if (!variant) {
      return res.status(400).json({ message: 'Variant not found' })
    }

    if (variant.quantity < quantity) {
      return res.status(400).json({ message: 'Variant quantity not enough' })
    }

    const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

    let existingCartItem = await CartItem.findOne({
      where: {
        VariantId: variantId,
        CartId: userCart.id,
      },
    })

    if (existingCartItem) {
      return res.status(409).json({ message: 'Product already in cart' })
    }

    await CartItem.create({
      VariantId: variantId,
      CartId: userCart.id,
      quantity,
    })

    const responseData = {
      id: variant.id,
      color: variant.color,
      size: variant.size,
      quantity: variant.quantity,
      price: variant.price,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
      ProductId: variant.ProductId,
      Product: {
        name: variant.Product.name,
        image: variant.Product.image,
      },
      CartItem: {
        quantity,
      },
    }

    res.status(201).json(responseData)
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
    const variant = await Variant.findByPk(variantId, {
      include: [
        {
          model: Product,
          attributes: ['name', 'image'],
        },
      ],
    })

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

    const responseData = {
      id: variant.id,
      color: variant.color,
      size: variant.size,
      quantity: variant.quantity,
      price: variant.price,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
      ProductId: variant.ProductId,
      Product: {
        name: variant.Product.name,
        image: variant.Product.image,
      },
      CartItem: {
        quantity: existingCartItem.quantity,
      },
    }

    res.status(201).json(responseData)
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

exports.syncCartItem = async (req, res) => {
  const { cartItems } = req.body
  const userId = req.user.userId
  try {
    const existingCart = await Cart.findOne({ where: { UserId: userId } })
    if (existingCart) {
      await existingCart.destroy()
    }

    const newCart = await Cart.create({ UserId: userId })

    const variants = await Promise.all(
      cartItems.map((item) => Variant.findByPk(item.variantId)),
    )

    if (variants.includes(null)) {
      return res
        .status(400)
        .json({ message: 'One or more variants do not exist' })
    }

    const newCartItems = cartItems.map((item) => ({
      VariantId: item.variantId,
      CartId: newCart.id,
      quantity: item.quantity,
    }))

    await CartItem.bulkCreate(newCartItems)

    const responseData = await Cart.findOne({
      where: { id: newCart.id },
      include: [
        {
          model: Variant,
          as: 'Variants',
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

    res.status(200).json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteAllCartItem = async (req, res) => {
  const userId = req.user.userId
  try {
    const existingCart = await Cart.findOne({ where: { UserId: userId } })
    if (existingCart) {
      await existingCart.destroy()
    }

    res.status(204)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
