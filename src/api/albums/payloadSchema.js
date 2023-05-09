const Joi = require('@hapi/joi')

const currentYear = new Date().getFullYear()

const AlbumPayloadSchema = Joi.object({
  name:
    Joi.string()
      .required(),

  year:
    Joi.number()
      .integer()
      .min(1900)
      .max(currentYear)
      .required()
})

module.exports = AlbumPayloadSchema
