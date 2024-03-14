const express = require('express')
const router = express.Router()
const advertiseController = require('../../controllers/advertise')
const authenticateToken = require('../../middleware/authenticateToken.js')
const hasPermission = require('../../middleware/hasPermission.js')

router.get(
  '/',
  authenticateToken,
  hasPermission('admin'),
  advertiseController.getAllAdvertises,
)

router.get(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  advertiseController.getAdvertise,
)

router.post(
  '/',
  authenticateToken,
  hasPermission('admin'),
  advertiseController.createAdvertise,
)

router.put(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  advertiseController.updateAdvertise,
)

router.delete(
  '/:id',
  authenticateToken,
  hasPermission('admin'),
  advertiseController.deleteAdvertise,
)

module.exports = router
