const autoBind = require('auto-bind')

class SongsHandler {
  constructor (service) {
    this._service = service

    this.postSong = this.postSong()
    this.getSongById = this.getSongById()
    this.getAllSong = this.getAllSong()
    this.putSongById = this.putSongById()
    this.deleteSongById = this.deleteSongById()
    autoBind(this)
  }

  async postSong (request, h) {
    const songId = await this._service.addSong(request.payload)

    return h
      .response({
        status: 'success',
        message: 'Song berhasil ditambahkan',
        data: {
          songId
        }
      })
      .code(201)
  }

  async getAllSong (request, h) {
    const songs = await this._service.getAllSong(request.query)
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongById (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongById (request, h) {
    const { id } = request.params

    await this._service.editSongById(id, request.payload)

    return {
      status: 'success',
      message: 'Song berhasil diperbarui'
    }
  }

  async deleteSongById (request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)

    return {
      status: 'success',
      message: 'Song berhasil dihapus'
    }
  }
}

module.exports = SongsHandler
