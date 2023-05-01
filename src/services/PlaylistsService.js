const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')
const AuthorizationError = require('../error/ClientError/AuthorizationError')
const { mapDBToPlaylistModel, mapDBToSongsModel } = require('../utils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async createPlaylist (name, owner) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan')

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: 'SELECT * FROM playlists INNER JOIN users on playlists.owner = users.id WHERE owner = $1',
      values: [owner]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylistModel)
  }

  async getPlaylistById (playlistId) {
    const query = {
      text: 'SELECT * FROM playlists INNER JOIN users on playlists.owner = users.id WHERE playlists.id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylistModel)[0]
  }

  async getPlaylistSongs (playlistId) {
    const query = {
      text: 'SELECT * FROM playlist_songs INNER JOIN songs ON song_id = songs.id WHERE playlist_id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToSongsModel)
  }

  async insertSongToPlaylist (songId, playlistId) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) throw new InvariantError('Lagu gagal ditambahkan ke Playlist')

    return result.rows[0].id
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
  }

  async deleteSongFromPlaylist (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
  }

  async verifyPlaylistOwner (playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) throw new NotFoundError('Playlist tidak ditemukan')

    const note = result.rows[0]
    if (note.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
  }
}

module.exports = PlaylistsService
