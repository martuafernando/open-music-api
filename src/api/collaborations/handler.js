const autoBind = require('auto-bind')

class CollaborationsHandler {
  constructor ({ usersService, playlistsService, collaborationsService }) {
    this._playlistsService = playlistsService
    this._usersService = usersService
    this._collaborationsService = collaborationsService
    autoBind(this)
  }

  async postCollaboration (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._usersService.getUserById(userId)

    const collaborationId = await this._collaborationsService.createCollaboration(playlistId, userId)

    return h
      .response({
        status: 'success',
        message: 'Collaborations berhasil ditambahkan',
        data: {
          collaborationId
        }
      })
      .code(201)
  }

  async deleteCollaboration (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._usersService.getUserById(userId)

    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return {
      status: 'success',
      message: 'Collaboration berhasil dihapus'
    }
  }
}

module.exports = CollaborationsHandler
