const ClientError = require('../../error/ClientError/ClientError')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum (request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload)
      const { title = 'untitled', body, tags } = request.payload

      const albumId = await this._service.addAlbum({ title, body, tags })

      return h
        .response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            albumId
          }
        })
        .code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message
          })
          .code(error.statusCode)
      }

      console.error(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.'
        })
        .code(500)
    }
  }

  async getAlbumById (request, h) {
    try {
      const { id } = request.params
      const album = await this._service.getAlbumById(id)
      return {
        status: 'success',
        data: {
          album
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message
          })
          .code(error.statusCode)
      }

      console.error(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.'
        })
        .code(500)
    }
  }

  async putAlbumById (request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload)
      const { id } = request.params

      await this._service.editAlbumById(id, request.payload)

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message
          })
          .code(error.statusCode)
      }

      console.error(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.'
        })
        .code(500)
    }
  }

  async deleteAlbumById (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteAlbumById(id)

      return {
        status: 'success',
        message: 'Catatan berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message
          })
          .code(error.statusCode)
      }

      console.error(error)
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.'
        })
        .code(500)
    }
  }
}

module.exports = AlbumsHandler
