const routes = (handler, CollaborationPayloadSchema) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaboration,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: CollaborationPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaboration,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: CollaborationPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  }
]

module.exports = routes
