const routes = (handler, { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema }) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthentication,
    options: {
      validate: {
        payload: PostAuthenticationPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthentication,
    options: {
      validate: {
        payload: PutAuthenticationPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthentication,
    options: {
      validate: {
        payload: DeleteAuthenticationPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  }
]

module.exports = routes
