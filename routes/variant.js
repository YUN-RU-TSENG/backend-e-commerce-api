const express = require('express')
const router = express.Router()
const variantController = require('../controllers/variant')

router.get('/', variantController.getAllVariants)
router.post('/', variantController.createVariant)

module.exports = router
