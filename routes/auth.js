const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', authController.register('user'))
router.post('/login', authController.login('user'))

module.exports = router
