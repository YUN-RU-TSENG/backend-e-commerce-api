const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart')
const authenticateToken = require('../middleware/authenticateToken.js')

router.get('/', authenticateToken, cartController.getCart)
router.post('/', authenticateToken, cartController.addToCart)
router.put('/:id', authenticateToken, cartController.updateCart)
router.delete('/:id', authenticateToken, cartController.removeCart)

module.exports = router
