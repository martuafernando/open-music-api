const routes = (handler, { PlaylistPayloadSchema, PlaylistSongPayloadSchema }) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylist,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: PlaylistPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylists,
    options: {
      auth: 'jwt_authorization'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistSong,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: PlaylistSongPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistSongs,
    options: {
      auth: 'jwt_authorization'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylist,
    options: {
      auth: 'jwt_authorization'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistSong,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: PlaylistSongPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  }
  // {
  //   method: 'POST',
  //   path: '/paylists/{id}/songs',
  //   handler: handler.postPaylistSong,
  //   options: {
  //     validate: {
  //       payload: PlaylistSongPayloadSchema,
  //       failAction: async (request, h, err) => {
  //         err.output.payload.status = 'fail'
  //         throw err
  //       }
  //     }
  //   }
  // },
]

module.exports = routes
