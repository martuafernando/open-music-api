const SongsHandler = require('./handler')
const routes = require('./routes')
const SongPayloadSchema = require('./payloadSchema')

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new SongsHandler(service)
    server.route(routes(handler, SongPayloadSchema))
  }
}
