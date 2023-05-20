const autoBind = require('auto-bind')
const ClientError = require('../../error/ClientError/ClientError')

class UploadsHandler {
  constructor ({ albumsService, likeAlbumsService, cacheService }) {
    this._likeAlbumsService = likeAlbumsService
    this._albumsService = albumsService
    this._cacheService = cacheService
    autoBind(this)
  }

  async postLikeAlbum (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: albumId } = request.params

    await this._albumsService.getAlbumById(albumId)
    const isLiked = await this._likeAlbumsService.isUserAlreadyLikeAlbum(albumId, credentialId)
    if (isLiked) throw new ClientError('Sudah disukai')

    await this._likeAlbumsService.likeAlbum(albumId, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album'
    })
    response.code(201)

    await this._cacheService.delete(`albumLike:${albumId}`)
    return response
  }

  async getLikeAlbum (request, h) {
    const { id: albumId } = request.params

    try {
      const result = await this._cacheService.get(`albumLike:${albumId}`)
      console.log('testing', await this._cacheService.get(`albumLike:${albumId}`))
      const response = h
        .response(JSON.parse(result))
      console.log(result)
      return response.header('X-Data-Source', 'cache')
    } catch {
      const likes = Number(await this._likeAlbumsService.readlikeAlbum(albumId))
      const response = h.response({
        status: 'success',
        data: { likes }
      })
      response.code(200)
      await this._cacheService.set(`albumLike:${albumId}`, JSON.stringify({
        status: 'success',
        data: { likes }
      }))
      return response
    }
  }

  async deleteLikeAlbum (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: albumId } = request.params

    await this._albumsService.getAlbumById(albumId)
    const isLiked = await this._likeAlbumsService.isUserAlreadyLikeAlbum(albumId, credentialId)
    if (!isLiked) throw new ClientError('Belum menyukai album ini')

    await this._likeAlbumsService.deletelikeAlbum(albumId, credentialId)
    const response = h.response({
      status: 'success',
      message: 'Berhasil unlike album'
    })
    response.code(200)

    await this._cacheService.delete(`albumLike:${albumId}`)
    return response
  }
}

module.exports = UploadsHandler
