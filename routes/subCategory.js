const express = require('express')
const router = express.Router()
const subCategoryController = require('../controllers/subCategory')

router.get('/', subCategoryController.getAllSubCategory)
router.post('/', subCategoryController.createSubCategory)

module.exports = router
