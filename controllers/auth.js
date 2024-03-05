const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword,
        })

        res.status(201).json({ message: 'User created successfully', user: { username, email } })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' })
        }

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '12h' })

        res.json({ message: 'Login successful', token })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message })
    }
}
