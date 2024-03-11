const express = require('express')
const router = express.Router()
const variantController = require('../../controllers/variant')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  variantController.getAllVariants,
)

router.get(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  variantController.getVariant,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('admin'),
  variantController.createVariant,
)

router.put(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  variantController.updateVariant,
)

router.delete(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  variantController.deleteVariant,
)

module.exports = router
