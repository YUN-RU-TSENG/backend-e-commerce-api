const express = require('express')
const router = express.Router()
const subCategoryController = require('../../controllers/subCategory')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  subCategoryController.getAllSubCategory,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('admin'),
  subCategoryController.createSubCategory,
)

router.put(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  subCategoryController.updateSubCategory,
)

router.delete(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  subCategoryController.deleteSubCategory,
)

module.exports = router
