const routes = (handler, payloadSchema) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbum,
    options: {
      validate: {
        payload: payloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumById
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumById,
    options: {
      validate: {
        payload: payloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumById
  }
]

module.exports = routes
