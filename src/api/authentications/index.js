const AuthenticationsHandler = require('./handler')
const { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require('./payloadSchema')
const routes = require('./routes')

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, options) => {
    const authenticationsHandler = new AuthenticationsHandler(options.service)
    server.route(routes(authenticationsHandler, { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema }))
  }
}
