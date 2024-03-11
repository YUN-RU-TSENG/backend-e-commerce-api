const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./config/database')
const associateModels = require('./config/associateModels')

const app = express()
const port = 3030

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subCategory')
const productRoutes = require('./routes/product')
const variantRoutes = require('./routes/variant')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/sub-category', subCategoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/variant', variantRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)

const authAdminRoutes = require('./routes/admin/auth')
const productAdminRoutes = require('./routes/admin/product')
const categoryAdminRoutes = require('./routes/admin/category')

app.use('/api/admin/auth', authAdminRoutes)
app.use('/api/admin/product', productAdminRoutes)
app.use('/api/admin/category', categoryAdminRoutes)

const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./utils/swaggerConfig.js')
app.use('/document/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

associateModels()

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!')
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
})
