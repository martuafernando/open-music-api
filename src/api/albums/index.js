const AlbumsHandler = require('./handler')
const routes = require('./routes')
const AlbumPayloadSchema = require('./payloadSchema')

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, options) => {
    const handler = new AlbumsHandler(options.service)
    server.route(routes(handler, AlbumPayloadSchema))
  }
}
