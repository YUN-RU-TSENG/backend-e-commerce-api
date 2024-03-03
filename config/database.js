const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('shop', '', '', {
    host: 'localhost',
    dialect: 'postgres',
})

module.exports = sequelize
