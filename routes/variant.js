const express = require('express')
const router = express.Router()
const variantController = require('../controllers/variant')

router.post('/', variantController.createVariant)
router.get('/', variantController.getAllVariants)

module.exports = router
