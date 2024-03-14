const express = require('express')
const router = express.Router()
const advertiseController = require('../controllers/advertise')

router.get('/', advertiseController.getAllAdvertises)
router.get('/:id', advertiseController.getAdvertise)

module.exports = router
