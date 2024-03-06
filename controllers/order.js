const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const Variant = require('../models/Variant')

exports.getAllOrder = async (req, res) => {
    try {
        const userId = req.userId

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

exports.createOrder = async (req, res) => {
    try {
        const { variants: orderItems } = req.body // 接收一組包含商品變體 id 以及數量的陣列

        const userId = req.userId

        const userOrder = await Order.create({ UserId: userId }) // 建立新的訂單

        const orderItemsPromises = orderItems.map(async (item) => {
            const { variantId, quantity } = item

            const variant = await Variant.findByPk(variantId)

            if (!variant) {
                return res.status(404).json({ message: 'Variant not found' })
            }

            if (!variant.quantity || variant.quantity < quantity) {
                return res.status(404).json({ message: 'Variant quantity not enough' })
            }

            await OrderItem.create({
                VariantId: variantId,
                OrderId: userOrder.id,
                quantity,
            })

            // 減少庫存數量
            variant.quantity -= quantity
            await variant.save()
        })

        await Promise.all(orderItemsPromises)

        res.status(201).json({ message: 'Order created successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.updateOrder = (req, res) => {
    res.status(200)
}

exports.deleteOrder = async (req, res) => {
    res.status(200)
}
