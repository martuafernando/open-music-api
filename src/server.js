require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const AlbumsService = require('./services/AlbumsService')

const init = async () => {
  const albumService = new AlbumsService()
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: albums,
    options: {
      service: albumService
    }
  })

  server.route({
    method: '*',
    path: '/{p*}', // catch-all path
    handler: function (request, h) {
      return h
        .response({
          status: 'fail',
          message: 'Not Found'
        })
        .code(404)
    }
  })

  server.ext('onPreResponse', (request, h) => {
    if (request.response.isBoom) {
      const err = request.response

      return h
        .response({
          status: err.status || err.output.payload.status,
          message: err.message || err.output.payload.message
        })
        .code(err.statusCode || err.output.payload.statusCode)
    }
    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
