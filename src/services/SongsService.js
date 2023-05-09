const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')
const { mapDBToDetailSongsModel } = require('../utils')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAllSong ({ title, performer }) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
      values: []
    }

    if (title) {
      query.text += ` WHERE LOWER(title) ~ LOWER($${query.values.length + 1})`
      query.values.push(title)
    }

    if (performer) {
      if (query.text.includes('WHERE')) {
        query.text += ` AND LOWER(performer) ~ LOWER($${query.values.length + 1})`
        query.values.push(performer)
      } else {
        query.text += ` WHERE LOWER(performer) ~ LOWER($${query.values.length + 1})`
        query.values.push(performer)
      }
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Song tidak ditemukan')
    }

    return result.rows
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan')

    return result.rows.map(mapDBToDetailSongsModel)[0]
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
  }
}

module.exports = SongsService
