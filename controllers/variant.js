const Variant = require('../models/Variant')

exports.createVariant = async (req, res) => {
    try {
        const { productId, color, size, quantity, price } = req.body
        const variant = await Variant.create({ ProductId: productId, color, size, quantity, price })
        res.status(201).json(variant)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.findAll()
        res.json(variants)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}