const express = require('express')
const router = express.Router()
const productController = require('../controllers/product')

router.get('/product', productController.getAllProducts)
router.get('/product/:id', productController.getProduct)

module.exports = router
