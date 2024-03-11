const express = require('express')
const router = express.Router()
const subCategoryController = require('../controllers/subCategory')

router.get('/', subCategoryController.getAllSubCategory)

module.exports = router

