const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart')
const authenticateToken = require('../middleware/authenticateToken.js')
const hasPermission = require('../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('user'),
  cartController.getCart,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('user'),
  cartController.addToCart,
)

router.put(
  '/',
  authenticateToken,
  hasPermission('user'),
  cartController.updateCartItem,
)

router.delete(
  '/',
  authenticateToken,
  hasPermission('user'),
  cartController.deleteCartItem,
)

router.post(
  '/sync',
  authenticateToken,
  hasPermission('user'),
  cartController.syncCartItem,
)

router.post(
  '/delete-all',
  authenticateToken,
  hasPermission('user'),
  cartController.deleteAllCartItem,
)

module.exports = router
