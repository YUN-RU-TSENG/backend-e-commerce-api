const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./config/database')

const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subCategory')
const productRoutes = require('./routes/product')

const app = express()
const port = 3030

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/sub-category', subCategoryRoutes)
app.use('/api/product', productRoutes)

// { force: true }

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
