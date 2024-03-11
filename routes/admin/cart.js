const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  cartController.getAllCarts,
)

module.exports = router
