const express = require('express')
const router = express.Router()
const productController = require('../controllers/product')
const authenticateToken = require('../middleware/authenticateToken.js')
const hasPermission = require('../middleware/hasPermission.js')

// user
router.get('/product', productController.getAllProducts)

// admin
router.post('/admin/product', productController.createProduct)
router.get('/admin/product', productController.getAllProducts)
router.put(
  '/admin/product/:id',
  authenticateToken,
  hasPermission('admin'),
  productController.updateProduct,
)
router.delete(
  '/admin/product/:id',
  authenticateToken,
  hasPermission('admin'),
  productController.deleteProduct,
)

module.exports = router
