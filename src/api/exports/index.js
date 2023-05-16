const ExportsHandler = require('./handler')
const routes = require('./routes')
const { ExportPlaylistsPayloadSchema } = require('./payloadSchema')

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, options) => {
    const exportsHandler = new ExportsHandler(options.service)
    server.route(routes(exportsHandler, ExportPlaylistsPayloadSchema))
  }
}
