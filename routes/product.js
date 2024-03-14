const express = require('express')
const router = express.Router()
const productController = require('../controllers/product')

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProduct)

module.exports = router
