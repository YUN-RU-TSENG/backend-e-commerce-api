const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category')

router.get('/', categoryController.getAllCategory)
router.post('/', categoryController.createCategory)

module.exports = router
