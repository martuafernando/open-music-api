const Joi = require('joi')

const fileHeaderValidation = (value, helpers) => {
  const allowedContentTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']
  if (!value.hapi.headers?.['content-type']) {
    return helpers.error('any.invalid')
  }

  const contentType = value.hapi.headers['content-type']

  if (!allowedContentTypes.includes(contentType)) {
    return helpers.error('any.invalid')
  }
  return value
}

const ImageHeadersSchema = Joi.object({
  cover: Joi.any().custom(fileHeaderValidation).required()
})

module.exports = { ImageHeadersSchema, fileHeaderValidation }
