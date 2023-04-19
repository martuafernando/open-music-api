const Joi = require('joi')

const SongPayloadSchema = Joi.object({
  title:
    Joi.string()
      .required(),

  year:
    Joi.number()
      .required(),

  genre:
    Joi.number()
      .required(),

  performer:
    Joi.number()
      .required(),

  duration:
    Joi.number(),

  albumId:
    Joi.string()
})

module.exports = SongPayloadSchema
