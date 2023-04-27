const routes = (handler, payloadSchema) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUser,
    options: {
      validate: {
        payload: payloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  }
]

module.exports = routes
