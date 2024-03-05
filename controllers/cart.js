const jwt = require('jsonwebtoken')
const { Variant, Product } = require('../models/Product')
const Cart = require('../models/Cart')

exports.addToCart = async (req, res) => {
    try {
        const { variantId, productId, quantity } = req.body

        const userId = req.userId

        const variant = await Variant.findByPk(variantId)
        const product = await Product.findByPk(productId)

        if (!variant || !product) {
            return res.status(404).json({ message: 'Variant or Product not found' })
        }

        const cart = await Cart.create({
            UserId: userId,
            ProductId: productId,
            VariantId: variantId,
            quantity,
            // 根據商品和變體設置其他商品細節
            price: variant.price,
            color: variant.color,
            size: variant.size,
            productName: product.name,
        })

        res.status(201).json(cart)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.userId

        const carts = await Cart.findAll({ where: { UserId: userId } })

        res.json(carts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.updateCart = async (req, res) => {
    try {
        const userId = req.userId

        const { id } = req.params
        const { quantity } = req.body

        const cart = await Cart.findByPk(id)

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        if (cart.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        await cart.update({ quantity })
        res.json(cart)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.removeCart = async (req, res) => {
    try {
        const userId = req.userId
        const { id } = req.params

        const cart = await Cart.findByPk(id)

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        if (cart.UserId !== userId) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        await cart.destroy()
        res.json({ message: 'Cart deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.calculateTotal = async (req, res) => {
    try {
        const tokenWithBearer = req.headers.authorization
        const token = tokenWithBearer.split(' ')[1]

        jwt.verify(token, 'your-secret-key', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' })
            }

            const userId = decoded.userId

            // 取得用戶購物車中的所有商品
            const carts = await Cart.findAll({ where: { UserId: userId } })

            // 計算總價格
            let totalPrice = 0
            for (const cart of carts) {
                totalPrice += cart.price * cart.quantity
            }

            res.json({ totalPrice })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.purchaseCart = async (req, res) => {
    try {
        const tokenWithBearer = req.headers.authorization
        const token = tokenWithBearer.split(' ')[1]

        jwt.verify(token, 'your-secret-key', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' })
            }

            const userId = decoded.userId

            // 取得用戶購物車中的所有商品
            const carts = await Cart.findAll({ where: { UserId: userId } })

            // 假設這裡是你處理購買邏輯的程式碼
            // 例如：更新庫存、生成訂單、清空購物車等等

            // 假設處理完購買後清空購物車
            await Cart.destroy({ where: { UserId: userId } })

            res.json({ message: 'Purchase completed successfully' })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
