const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order')
const authenticateToken = require('../middleware/authenticateToken.js')
const hasPermission = require('../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('user'),
  orderController.getAllOrdersOfUser,
)

router.get(
  '/:id',
  authenticateToken,
  hasPermission('user'),
  orderController.getOrderOfUser,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('user'),
  orderController.createOrders,
)

router.post(
  '/:id/cancel',
  authenticateToken,
  hasPermission('user'),
  orderController.cancelOrderByUser,
)

router.post(
  '/calculate-price',
  authenticateToken,
  hasPermission('user'),
  orderController.calculatePrice,
)

module.exports = router
