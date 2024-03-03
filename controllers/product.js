const { Variant, Product } = require('../models/Product')

exports.createProduct = async (req, res) => {
    try {
        const { category, subcategory, name } = req.body
        const product = await Product.create({ category, subcategory, name })
        res.status(201).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: Variant })
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        const { category, subcategory, name } = req.body
        await product.update({ category, subcategory, name })
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        await product.destroy()
        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
