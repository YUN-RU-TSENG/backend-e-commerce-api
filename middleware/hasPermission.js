const User = require('../models/User.js')

function hasPermission(role) {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId
      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      if (user.role !== role) {
        return res.status(403).json({ message: 'Permission denied' })
      }

      next()
    } catch (error) {
      console.error('Error in hasPermission middleware:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

module.exports = hasPermission
