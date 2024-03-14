const Advertise = require('../models/Advertise')
const Joi = require('joi')

const advertiseSchema = Joi.object({
  image: Joi.string().required(),
  name: Joi.string().required(),
})

exports.getAllAdvertises = async (req, res) => {
  try {
    const advertises = await Advertise.findAll()
    res.status(200).json(advertises)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getAdvertise = async (req, res) => {
  try {
    const advertiseId = req.params.id
    const existingAdvertise = await Advertise.findByPk(advertiseId)

    if (!existingAdvertise) {
      res.status(400).json({ message: 'Advertise not found' })
    }

    res.status(200).json(existingAdvertise)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.createAdvertise = async (req, res) => {
  try {
    const { error } = advertiseSchema.validate(req.body)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const { name, image } = req.body

    const existingAdvertise = await Advertise.findOne({
      where: { name, image },
    })

    if (existingAdvertise) {
      return res.status(400).json({ error: 'Advertise already exists' })
    }

    const advertise = await Advertise.create({
      name,
      image,
    })

    res.status(201).json(advertise)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.updateAdvertise = async (req, res) => {
  try {
    const { error } = advertiseSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { image, name } = req.body
    const advertiseId = req.params.id

    const existingAdvertise = await Advertise.findByPk(advertiseId)

    if (!existingAdvertise) {
      return res.status(400).json({ error: 'Advertise not found' })
    }

    existingAdvertise.name = name
    existingAdvertise.image = image

    await existingAdvertise.save()
    res.status(200).json(existingAdvertise)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.deleteAdvertise = async (req, res) => {
  try {
    const advertiseId = req.params.id
    const existingAdvertise = await Advertise.findByPk(advertiseId)

    if (!existingAdvertise) {
      return res.status(400).json({ message: 'Advertise not found' })
    }

    await existingAdvertise.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
