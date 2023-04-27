require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const users = require('./api/users')

const AlbumsService = require('./services/AlbumsService')
const SongsService = require('./services/SongsService')
const UsersService = require('./services/UsersService')

const init = async () => {
  const albumService = new AlbumsService()
  const songService = new SongsService()
  const userService = new UsersService()
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

  await server.register({
    plugin: songs,
    options: {
      service: songService
    }
  })

  await server.register({
    plugin: users,
    options: {
      service: userService
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
          status: err.status || err.output.payload.status || 'error',
          message: err.message || err.output.payload.message || 'Internal Server Error'
        })
        .code(err.statusCode || err.output.payload.statusCode || 500)
    }
    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
