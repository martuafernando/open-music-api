const autoBind = require('auto-bind')
const ClientError = require('../../error/ClientError/ClientError')

class UploadsHandler {
  constructor ({ albumsService, likeAlbumsService }) {
    this._likeAlbumsService = likeAlbumsService
    this._albumsService = albumsService
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
    return response
  }

  async getLikeAlbum (request, h) {
    const { id: albumId } = request.params

    const { cache, likeCount } = await this._likeAlbumsService.readlikeAlbum(albumId)
    const response = h.response({
      status: 'success',
      data: { likes: Number(likeCount) }
    })
    response.code(200)
    return cache ? response.header('X-Data-Source', 'cache') : response
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

    return response
  }
}

module.exports = UploadsHandler
