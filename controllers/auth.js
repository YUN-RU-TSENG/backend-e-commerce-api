const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Joi = require('joi')

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { username, email, password } = req.body

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

    res
      .status(201)
      .json({ message: 'User created successfully', user: { username, email } })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
      expiresIn: '12h',
    })

    res.json({ message: 'Login successful', token })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}
