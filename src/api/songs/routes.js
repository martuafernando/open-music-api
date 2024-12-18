const routes = (handler, payloadSchema) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSong,
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
    path: '/songs',
    handler: handler.getAllSong
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongById
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongById,
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
    path: '/songs/{id}',
    handler: handler.deleteSongById
  }
]

module.exports = routes
