const { Order, Variant, Product } = require('../models')

exports.createOrder = async (req, res) => {
    try {
        const { variantId, productId, quantity } = req.body
        const userId = req.userId

        // 找到相應的變體和商品
        const variant = await Variant.findByPk(variantId)
        const product = await Product.findByPk(productId)

        if (!variant || !product) {
            return res.status(404).json({ message: 'Variant or Product not found' })
        }

        // 假設這裡是你處理生成訂單的邏輯，並減少庫存的程式碼
        // 假設庫存減少成功後，創建訂單
        const order = await Order.create({
            UserId: userId,
            ProductId: productId,
            VariantId: variantId,
            quantity,
            price: variant.price,
            color: variant.color,
            size: variant.size,
            productName: product.name,
        })

        res.status(201).json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getOrders = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await Order.findAll({ where: { UserId: userId } })
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
