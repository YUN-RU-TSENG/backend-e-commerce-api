const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  orderController.getAllOrders,
)

router.post(
  '/:id/cancel',
  authenticateToken,
  hasPermission('admin'),
  orderController.cancelOrderByAdmin,
)

router.post(
  '/:id/sort',
  authenticateToken,
  hasPermission('admin'),
  orderController.sortOrderByAdmin,
)

module.exports = router
