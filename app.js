const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./config/database')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const variantRoutes = require('./routes/variant')
const cartRoutes = require('./routes/cart')

const app = express()
const port = 3030

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/variant', variantRoutes)
app.use('/api/cart', cartRoutes)

// { force: true }
sequelize.sync().then(() => {
    console.log('Database & tables created!')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
