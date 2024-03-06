const Variant = require('../models/Variant')
const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')

exports.addToCart = async (req, res) => {
    try {
        const { variantId, quantity = 1 } = req.body

        const userId = req.userId

        const variant = await Variant.findByPk(variantId)

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' })
        }

        if (!variant.quantity) {
            return res.status(404).json({ message: 'Variant quantity not enough' })
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
        } else {
            const cartItem = await CartItem.create({
                VariantId: variantId,
                CartId: userCart.id,
                quantity,
            })
            res.status(201).json(cartItem)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.userId

        const [userCart] = await Cart.findOrCreate({
            where: { UserId: userId },
            include: [
                {
                    model: Variant,
                    through: { attributes: ['quantity'] },
                },
            ],
        })

        res.json(userCart)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.updateCartItem = async (req, res) => {
    try {
        const { variantId, quantity } = req.body

        const userId = req.userId

        const variant = await Variant.findByPk(variantId)

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' })
        }

        if (!variant.quantity) {
            return res.status(404).json({ message: 'Variant quantity not enough' })
        }

        const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

        const existingCartItem = await CartItem.findOne({
            where: {
                VariantId: variantId,
                CartId: userCart.id,
            },
        })

        if (existingCartItem) {
            existingCartItem.quantity = quantity
            await existingCartItem.save()
            res.status(200).json(existingCartItem)
        } else {
            return res.status(404).json({ message: 'CartItem not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.removeCartItem = async (req, res) => {
    try {
        const { variantId } = req.body

        const userId = req.userId

        const variant = await Variant.findByPk(variantId)

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' })
        }

        const [userCart] = await Cart.findOrCreate({ where: { UserId: userId } })

        const existingCartItem = await CartItem.findOne({
            where: {
                VariantId: variantId,
                CartId: userCart.id,
            },
        })

        if (existingCartItem) {
            await existingCartItem.destroy()
            res.status(204).send()
        } else {
            res.status(404).json({ message: 'CartItem not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
