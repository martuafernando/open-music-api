const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor ({ albumsService, cacheService }) {
    this._albumsService = albumsService
    this._cacheService = cacheService
    console.log(this._albumsService)
    console.log(this._cacheService)
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

    try {
      const result = await this._cacheService.get(`albumId:${id}`)
      return result.header('X-Data-Source', 'cache')
    } catch {
      const album = await this._albumsService.getAlbumById(id)
      await this._cacheService.set(`albumId:${id}`, JSON.stringify({
        status: 'success',
        data: { album }
      }))
      return {
        status: 'success',
        data: { album }
      }
    }
  }

  async putAlbumById (request, h) {
    const { id } = request.params

    await this._albumsService.editAlbumById(id, request.payload)
    await this._cacheService.delete(`albumId:${id}`)
    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumById (request, h) {
    const { id } = request.params
    await this._albumsService.deleteAlbumById(id)
    await this._cacheService.delete(`albumId:${id}`)
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
