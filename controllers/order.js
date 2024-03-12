const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const Variant = require('../models/Variant')
const User = require('../models/User')
const Joi = require('joi')
const sequelize = require('../config/database.js')

const orderSchema = Joi.object({
  variants: Joi.array()
    .items(
      Joi.object({
        variantId: Joi.number().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .required(),
})

const updateOrderSchema = Joi.object({
  status: Joi.string().required(),
})

exports.getAllOrdersOfUser = async (req, res) => {
  try {
    const userId = req.user.userId

    const userOrder = await Order.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Variant,
          through: { attributes: ['quantity'] },
        },
      ],
    })

    res.json(userOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getOrderOfUser = async (req, res) => {
  try {
    const orderId = req.params.id
    const existingOrder = await Order.findOne({
      where: { id: orderId },
      include: [
        { model: User },
        { model: Variant, through: { attributes: ['quantity'] } },
      ],
    })

    if (!existingOrder) {
      res.status(400).json({ message: 'Order not found' })
    }

    res.status(200).json(existingOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      include: [
        {
          model: Order,
          include: [
            {
              model: Variant,
              through: { attributes: ['quantity'] },
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

exports.createOrders = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const { error } = orderSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { variants: orderItems } = req.body
    const userId = req.user.userId

    let totalPrice = 0

    const userOrder = await Order.create(
      { UserId: userId, status: 'established', price: totalPrice },
      { transaction },
    )

    for (const item of orderItems) {
      const { variantId, quantity } = item

      const variant = await Variant.findByPk(variantId)

      if (!variant) {
        await transaction.rollback()
        return res.status(400).json({ message: 'Variant not found' })
      }

      if (variant.quantity < quantity) {
        await transaction.rollback()
        return res.status(400).json({ message: 'Variant quantity not enough' })
      }

      const existingOrderItem = await OrderItem.findOne({
        where: {
          VariantId: variantId,
          OrderId: userOrder.id,
        },
      })

      if (existingOrderItem) {
        await transaction.rollback()
        return res.status(400).json({ message: 'Order Variant duplicate' })
      }

      await OrderItem.create(
        {
          VariantId: variantId,
          OrderId: userOrder.id,
          quantity,
        },
        { transaction },
      )

      await variant.update(
        { quantity: variant.quantity - quantity },
        { transaction },
      )

      totalPrice += variant.price * quantity
    }

    await userOrder.update({ price: totalPrice }, { transaction })
    await transaction.commit()

    res.status(201).json(userOrder)
  } catch (error) {
    await transaction.rollback()
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateOrderStatusByUser = async (req, res) => {
  try {
    const { error } = updateOrderSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const orderId = req.params.id
    const { status } = req.body

    const existingOrder = await Order.findByPk(orderId)

    if (!existingOrder) {
      return res.status(400).json({ message: 'Order not found' })
    }

    if (['established'].some((item) => item === existingOrder.status)) {
      if (status === 'cancelled') {
        existingOrder.status = status
        await existingOrder.save()
        return res.status(200).json({ existingOrder })
      }
    }

    return res.status(400).json({ message: 'Order status error' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { error } = updateOrderSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const orderId = req.params.id
    const { status } = req.body

    const existingOrder = await Order.findByPk(orderId)

    if (!existingOrder) {
      return res.status(400).json({ message: 'Order not found' })
    }

    if (
      ['established', 'sorting'].some((item) => item === existingOrder.status)
    ) {
      if (status === 'cancelled') {
        existingOrder.status = status
        await existingOrder.save()
        return res.status(200).json({ existingOrder })
      }
    }

    return res.status(400).json({ message: 'Order status error' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const existingOrder = await Order.findByPk(orderId)

    if (!existingOrder) {
      return res.status(400).json({ message: 'Order not found' })
    }

    await existingOrder.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.calculatePrice = async (req, res) => {
  const { variants } = req.body

  try {
    let totalPrice = 0

    for (const variant of variants) {
      const { variantId, quantity } = variant
      const existingVariant = await Variant.findByPk(variantId)

      if (!existingVariant) {
        return res.status(400).json({ message: `Variant not found` })
      }

      if (existingVariant.quantity < quantity) {
        return res.status(400).json({ message: `Variant not enough` })
      }

      totalPrice += existingVariant.price * quantity
    }

    res.status(200).json({
      totalPrice,
      quantity: variants.map((item) => item.quantity).reduce((a, b) => a + b),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
