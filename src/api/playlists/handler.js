const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor ({ playlistsService, playlistSongsService, usersService, songService }) {
    this._playlistsService = playlistsService
    this._playlistSongsService = playlistSongsService
    this._usersService = usersService
    this._songService = songService
    autoBind(this)
  }

  async postPlaylist (request, h) {
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials
    const playlistId = await this._playlistsService.createPlaylist(name, credentialId)

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      .code(201)
  }

  async getPlaylists (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistsService.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async postPlaylistSong (request, h) {
    const { songId } = request.payload
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwnerOrCollaborator(playlistId, credentialId)
    await this._songService.getSongById(songId)
    await this._playlistsService.insertSongToPlaylist(songId, playlistId, credentialId)

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke Playlist'
      })
      .code(201)
  }

  async getPlaylistSongs (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistOwnerOrCollaborator(playlistId, credentialId)
    const playlist = await this._playlistsService.getPlaylistById(playlistId)
    const songs = await this._playlistsService.getPlaylistSongs(playlistId)

    playlist.songs = songs

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async getPlaylistActivities (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistOwnerOrCollaborator(playlistId, credentialId)
    const activities = await this._playlistsService.getPlaylistActivities(playlistId)

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }

  async deletePlaylist (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._playlistsService.deletePlaylistById(playlistId)

    return {
      status: 'success',
      message: 'playlist berhasil dihapus'
    }
  }

  async deletePlaylistSong (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params
    const { songId } = request.payload

    await this._playlistsService.verifyPlaylistOwnerOrCollaborator(playlistId, credentialId)
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId, credentialId)

    return {
      status: 'success',
      message: 'Lagu dari playlists berhasil dihapus'
    }
  }
}

module.exports = PlaylistsHandler
