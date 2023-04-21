class AlbumsHandler {
  constructor (service) {
    this._service = service

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum (request, h) {
    const albumId = await this._service.addAlbum(request.payload)

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
    const album = await this._service.getAlbumById(id)
    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumById (request, h) {
    const { id } = request.params

    await this._service.editAlbumById(id, request.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumById (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
