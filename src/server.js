require('dotenv').config()

const path = require('path')
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')

const albums = require('./api/albums')
const songs = require('./api/songs')
const users = require('./api/users')
const authentications = require('./api/authentications')
const playlists = require('./api/playlists')
const collaborations = require('./api/collaborations')
const _exports = require('./api/exports')
const uploads = require('./api/uploads')
const albumLikes = require('./api/albumLikes')

const tokenManager = require('./tokenize/TokenManager')

const AlbumsService = require('./services/AlbumsService')
const SongsService = require('./services/SongsService')
const UsersService = require('./services/UsersService')
const AuthenticationsService = require('./services/AuthenticationsService')
const PlaylistsService = require('./services/PlaylistsService')
const CollaborationsService = require('./services/CollaborationsService')
const producerService = require('./services/ProducerService.js')
const StorageService = require('./services/StorageService')
const LikeAlbumsService = require('./services/LikesAlbumService')
const CacheService = require('./services/CacheService')

const init = async () => {
  const albumsService = new AlbumsService()
  const songService = new SongsService()
  const usersService = new UsersService()
  const authenticationService = new AuthenticationsService()
  const playlistsService = new PlaylistsService()
  const collaborationsService = new CollaborationsService()
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'))
  const likeAlbumsService = new LikeAlbumsService()
  const cacheService = new CacheService()

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
    },
    {
      plugin: Inert
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
        service: { albumsService, cacheService }
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
        service: usersService
      }
    },
    {
      plugin: authentications,
      options: {
        service: { authenticationsService: authenticationService, usersService, tokenManager }
      }
    },
    {
      plugin: playlists,
      options: {
        service: { playlistsService, usersService, songService }
      }
    },
    {
      plugin: collaborations,
      options: {
        service: { usersService, playlistsService, collaborationsService }
      }
    },
    {
      plugin: _exports,
      options: {
        service: { producerService, playlistsService }
      }
    },
    {
      plugin: uploads,
      options: {
        service: { storageService, albumsService }
      }
    },
    {
      plugin: albumLikes,
      options: {
        service: { albumsService, likeAlbumsService, cacheService }
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
