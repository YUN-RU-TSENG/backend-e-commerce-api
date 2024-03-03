const express = require('express')
const router = express.Router()
const variantController = require('../controllers/variant')

router.post('/', variantController.createVariant)
router.get('/', variantController.getAllVariants)
router.put('/:id', variantController.updateVariant)
router.delete('/:id', variantController.deleteVariant)

module.exports = router
