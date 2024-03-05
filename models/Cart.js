const sequelize = require('../config/database')

const Cart = sequelize.define('Cart', {})

Cart.associate = (models) => {
    Cart.belongsTo(models.User)
    Cart.belongsToMany(models.Variant, { through: models.CartItem })
}

module.exports = Cart
