const UploadsHandler = require('./handler')
const routes = require('./routes')
const { ImageHeadersSchema } = require('./schema')

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, options) => {
    const exportsHandler = new UploadsHandler(options.service)
    server.route(routes(exportsHandler, ImageHeadersSchema))
  }
}
