const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')
const { mapDBToAlbumsModel, mapDBToSongsModel } = require('../utils')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, null, $4, $4) RETURNING id',
      values: [id, name, year, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    const querySongs = {
      text: 'SELECT * FROM songs WHERE "albumId" = $1',
      values: [id]
    }
    const songs = await this._pool.query(querySongs)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const albumWithSongs = result.rows.map(mapDBToAlbumsModel)[0]
    albumWithSongs.songs = songs.rows.map(mapDBToSongsModel)
    return albumWithSongs
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async upsertCover (albumId, coverFilename) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [coverFilename, updatedAt, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    return result.rows
  }

  async getProperty (id, property) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan')
    return result.rows[0][property]
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = AlbumsService
