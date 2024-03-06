const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order')
const authenticateToken = require('../middleware/authenticateToken.js')

router.get('/', authenticateToken, orderController.getAllOrder)
router.post('/', authenticateToken, orderController.createOrder)

module.exports = router
