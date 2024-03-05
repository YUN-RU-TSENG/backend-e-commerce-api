const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart')
const authenticateToken = require('../middleware/authenticateToken.js')

router.get('/', authenticateToken, cartController.getCart)
router.post('/', authenticateToken, cartController.addToCart)

module.exports = router
