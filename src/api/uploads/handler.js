class UploadsHandler {
  constructor ({ albumsService, storageService }) {
    this._albumsService = albumsService
    this._storageService = storageService

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params

    const oldFilename = await this._albumsService.getProperty(id, 'coverUrl')
    await this._storageService.deleteFile(oldFilename)
    const filename = await this._storageService.writeFile(cover, cover.hapi)
    await this._albumsService.upsertCover(id, filename)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })
    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
