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

app.use('/api/admin/auth', authAdminRoutes)

associateModels()

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!')
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
})
