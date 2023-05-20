const UploadsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, options) => {
    const exportsHandler = new UploadsHandler(options.service)
    server.route(routes(exportsHandler))
  }
}
