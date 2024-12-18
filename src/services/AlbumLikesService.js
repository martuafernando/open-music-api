const { Pool } = require('pg')
const InvariantError = require('../error/ClientError/InvariantError')
const NotFoundError = require('../error/ClientError/NotFoundError')

class LikeAlbumsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async likeAlbum (albumId, userId) {
    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2) RETURNING album_id',
      values: [albumId, userId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) throw new InvariantError('Gagal menyukai Album')
    await this._cacheService.delete(`albumLike:${albumId}`)
    return result.rows[0].id
  }

  async isUserAlreadyLikeAlbum (albumId, userId) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) return false
    return true
  }

  async readlikeAlbum (albumId) {
    try {
      const result = await this._cacheService.get(`albumLike:${albumId}`)
      return { cache: true, likeCount: JSON.parse(result) }
    } catch {
      const query = {
        text: 'SELECT COUNT(album_id) FROM album_likes WHERE album_id = $1',
        values: [albumId]
      }

      const result = await this._pool.query(query)
      await this._cacheService.set(`albumLike:${albumId}`, JSON.stringify(result.rows[0]?.count))
      return { cache: false, likeCount: result.rows[0]?.count }
    }
  }

  async deletelikeAlbum (albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING album_id',
      values: [albumId, userId]
    }

    const result = await this._pool.query(query)
    await this._cacheService.delete(`albumLike:${albumId}`)
    if (!result.rowCount) throw new NotFoundError('Album tidak ditemukan')
  }
}

module.exports = LikeAlbumsService
