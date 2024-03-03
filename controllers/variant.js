const { Variant } = require('../models/Product')

exports.createVariant = async (req, res) => {
    try {
        const { productId, color, size, quantity, price } = req.body
        const variant = await Variant.create({ ProductId: productId, color, size, quantity, price })
        res.status(201).json(variant)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    } finally {
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

exports.updateVariant = async (req, res) => {
    const { id } = req.params
    try {
        const variant = await Variant.findByPk(id)
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' })
        }
        const { color, size, quantity, price } = req.body
        await variant.update({ color, size, quantity, price })
        res.json(variant)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.deleteVariant = async (req, res) => {
    const { id } = req.params
    try {
        const variant = await Variant.findByPk(id)
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' })
        }
        await variant.destroy()
        res.json({ message: 'Variant deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
