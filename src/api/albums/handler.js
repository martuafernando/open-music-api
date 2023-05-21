const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor (albumsService) {
    this._albumsService = albumsService
    autoBind(this)
  }

  async postAlbum (request, h) {
    const albumId = await this._albumsService.addAlbum(request.payload)

    return h
      .response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId
        }
      })
      .code(201)
  }

  async getAlbumById (request, h) {
    const { id } = request.params

    const album = await this._albumsService.getAlbumById(id)
    return {
      status: 'success',
      data: { album }
    }
  }

  async putAlbumById (request, h) {
    const { id } = request.params

    await this._albumsService.editAlbumById(id, request.payload)
    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumById (request, h) {
    const { id } = request.params
    await this._albumsService.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
