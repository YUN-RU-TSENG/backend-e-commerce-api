const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  productController.getAllProducts,
)

router.get(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  productController.getProduct,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('admin'),
  productController.createProduct,
)

router.put(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  productController.updateProduct,
)

router.delete(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  productController.deleteProduct,
)

module.exports = router
