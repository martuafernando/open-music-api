const PlaylistsHandler = require('./handler')
const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./payloadSchema')
const routes = require('./routes')

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, options) => {
    const playlistsHandler = new PlaylistsHandler(options.service)
    server.route(routes(playlistsHandler, { PlaylistPayloadSchema, PlaylistSongPayloadSchema }))
  }
}
