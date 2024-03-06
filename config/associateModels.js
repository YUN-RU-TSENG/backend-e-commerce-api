const db = require('../models/index')

const associateModels = () => {
    Object.keys(db).forEach(function (modelName) {
        if (!!db[modelName].associate) {
            db[modelName].associate(db)
        }
    })
}

module.exports = associateModels
