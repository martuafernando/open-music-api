class SongsHandler {
  constructor (service) {
    this._service = service

    this.postSong = this.postSong.bind(this)
    this.getSongById = this.getSongById.bind(this)
    this.getAllSong = this.getAllSong.bind(this)
    this.putSongById = this.putSongById.bind(this)
    this.deleteSongById = this.deleteSongById.bind(this)
  }

  async postSong (request, h) {
    const { title, year, genre, performer, duration, albumId } = request.payload
    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })

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
    const {title, performer} = request.query
    const songs = await this._service.getAllSong({ title, performer })
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
