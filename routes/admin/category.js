const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/category')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  categoryController.getAllCategory,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('admin'),
  categoryController.createCategory,
)

router.put(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  categoryController.updateCategory,
)

router.delete(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  categoryController.deleteCategory,
)

module.exports = router
