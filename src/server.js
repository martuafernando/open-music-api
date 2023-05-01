require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const albums = require('./api/albums')
const songs = require('./api/songs')
const users = require('./api/users')
const authentications = require('./api/authentications')
const playlists = require('./api/playlists')

const tokenManager = require('./tokenize/TokenManager')

const AlbumsService = require('./services/AlbumsService')
const SongsService = require('./services/SongsService')
const UsersService = require('./services/UsersService')
const AuthenticationsService = require('./services/AuthenticationsService')
const PlaylistsService = require('./services/PlaylistsService')

const init = async () => {
  const albumService = new AlbumsService()
  const songService = new SongsService()
  const userService = new UsersService()
  const authenticationService = new AuthenticationsService()
  const playlistsService = new PlaylistsService()

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('jwt_authorization', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService
      }
    },
    {
      plugin: songs,
      options: {
        service: songService
      }
    },
    {
      plugin: users,
      options: {
        service: userService
      }
    },
    {
      plugin: authentications,
      options: {
        service: { authenticationsService: authenticationService, userService, tokenManager }
      }
    },
    {
      plugin: playlists,
      options: {
        service: { playlistsService, userService, songService }
      }
    }
  ])

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
