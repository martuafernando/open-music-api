const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')

class CollaborationsService {
  constructor () {
    this._pool = new Pool()
  }

  async createCollaboration (playlistId, userId) {
    const id = nanoid(16)

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan')

    return result.rows[0].id
  }

  async deleteCollaboration (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Collaborations gagal dihapus. Id tidak ditemukan')
  }
}

module.exports = CollaborationsService
