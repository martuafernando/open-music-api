const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')
const AuthorizationError = require('../error/ClientError/AuthorizationError')
const { mapDBToPlaylistModel, mapDBToSongsModel, mapDBToPlaylistActivityModel } = require('../utils')

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
      text: `SELECT playlists.id, name, username FROM playlists
            INNER JOIN users ON playlists.owner = users.id
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylistModel)
  }

  async isPlaylistOwner (playlistId, userId) {
    const query = {
      text: `SELECT * FROM playlists
            WHERE playlists.id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan')

    const playlist = result.rows[0]
    if (playlist.owner === userId) return true
    return false
  }

  async getPlaylistById (playlistId) {
    const query = {
      text: `SELECT * FROM playlists
            INNER JOIN users on playlists.owner = users.id
            WHERE playlists.id = $1`,
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

  async getPlaylistActivities (playlistId) {
    const query = {
      text: `SELECT * FROM playlist_song_activities
            INNER JOIN playlists ON playlist_song_activities.playlist_id = playlists.id
            INNER JOIN users ON playlist_song_activities.user_id = users.id
            INNER JOIN songs ON playlist_song_activities.song_id = songs.id
            LEFT JOIN collaborations ON collaborations.playlist_id = playlist_song_activities.id
            WHERE playlist_song_activities.playlist_id = $1
            ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylistActivityModel)
  }

  async insertSongToPlaylist (songId, playlistId, userId) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
    const queries = [
      {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id;',
        values: [id, playlistId, songId, createdAt, updatedAt]
      },
      {
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id;',
        values: [id, playlistId, songId, userId, 'add', createdAt]
      }
    ]

    const result = []
    for (let i = 0; i < queries.length; i++) {
      result[i] = await this._pool.query(queries[i])
      if (!result[i]?.rows?.[0]?.id) throw new InvariantError('Lagu gagal ditambahkan ke Playlist')
    }

    return result[0].rows[0].id
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
  }

  async deleteSongFromPlaylist (playlistId, songId, userId) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const queries = [
      {
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
        values: [playlistId, songId]
      },
      {
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id;',
        values: [id, playlistId, songId, userId, 'delete', createdAt]
      }
    ]

    const result = []
    for (let i = 0; i < queries.length; i++) {
      result[i] = await this._pool.query(queries[i])
      if (!result[i]?.rows?.[0]?.id) throw new InvariantError('Lagu gagal dihapus dari Playlist')
    }
  }

  async verifyPlaylistOwner (playlistId, owner) {
    const query = {
      text: `SELECT * FROM playlists
            WHERE playlists.id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan')

    const playlist = result.rows[0]
    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
  }

  async verifyPlaylistOwnerOrCollaborator (playlistId, owner) {
    const query = {
      text: `SELECT * FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan')

    const playlist = result.rows[0]
    if (playlist.owner !== owner && playlist.user_id !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
  }
}

module.exports = PlaylistsService
