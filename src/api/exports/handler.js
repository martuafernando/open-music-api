const autoBind = require('auto-bind')
const AuthorizationError = require('../../error/ClientError/AuthorizationError')

class ExportsHandler {
  constructor ({ producerService, playlistsService }) {
    this._producerService = producerService
    this._playlistsService = playlistsService
    autoBind(this)
  }

  async postExportPlaylists (request, h) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    const isOwner = await this._playlistsService.isPlaylistOwner(playlistId, credentialId)
    if (!isOwner) throw new AuthorizationError('Tidak berhak mengakses playlists')

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._producerService.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
