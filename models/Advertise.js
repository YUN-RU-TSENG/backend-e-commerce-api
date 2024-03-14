const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Advertise = sequelize.define('Advertise', {
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

Advertise.associate = () => {}

module.exports = Advertise
