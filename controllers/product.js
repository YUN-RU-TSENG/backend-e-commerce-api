const Product = require('../models/Product')
const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Variant = require('../models/Variant')
const Joi = require('joi')

const productSchema = Joi.object({
  categoryId: Joi.number().required(),
  subCategoryId: Joi.number().required(),
  name: Joi.string().required(),
  image: Joi.string().required(),
})

const updateProductSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
})

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.status(200).json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const existingProduct = await Product.findOne({
      where: { id: productId },
      include: [
        { model: Variant },
        { model: Category },
        { model: SubCategory },
      ],
    })

    if (!existingProduct) {
      res.status(400).json({ message: 'Product not found' })
    }

    res.status(200).json(existingProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { categoryId, subCategoryId, name, image } = req.body

    // 檢查分類和子分類是否存在
    const category = await Category.findByPk(categoryId)
    const subCategory = await SubCategory.findByPk(subCategoryId)

    if (!category || !subCategory) {
      return res
        .status(404)
        .json({ message: 'Category or SubCategory not found' })
    }

    const existingProduct = await Product.findOne({
      where: { name, SubCategoryId: subCategoryId, CategoryId: categoryId },
    })

    if (existingProduct) {
      return res.status(400).json({ error: 'Product already exists' })
    }

    // 創建產品並關聯到分類和子分類
    const product = await Product.create({
      name,
      SubCategoryId: subCategoryId,
      CategoryId: categoryId,
      image,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { error } = updateProductSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { image, name } = req.body
    const productId = req.params.id

    const existingProduct = await Product.findByPk(productId)

    if (!existingProduct) {
      return res.status(400).json({ error: 'Product not found' })
    }

    existingProduct.name = name
    existingProduct.image = image

    await existingProduct.save()
    res.status(200).json(existingProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const existingProduct = await Product.findByPk(productId)

    if (!existingProduct) {
      return res.status(400).json({ message: 'Product not found' })
    }

    await existingProduct.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
