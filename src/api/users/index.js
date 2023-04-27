const UsersHandler = require('./handler')
const routes = require('./routes')
const UserPayloadSchema = require('./payloadSchema')

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new UsersHandler(service)
    server.route(routes(handler, UserPayloadSchema))
  }
}
