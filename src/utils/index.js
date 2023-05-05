/* eslint-disable camelcase */

const mapDBToAlbumsModel = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year: parseInt(year)
})

const mapDBToSongsModel = ({
  id,
  title,
  performer
}) => ({
  id,
  title,
  performer
})

const mapDBToDetailSongsModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId
}) => ({
  id,
  title,
  year: parseInt(year),
  genre,
  performer,
  duration,
  albumId
})

const mapDBToPlaylistModel = ({
  id,
  name,
  username
}) => ({
  id,
  name,
  username
})

const mapDBToPlaylistActivityModel = ({
  username,
  title,
  action,
  time
}) => ({
  username,
  title,
  action,
  time
})

module.exports = {
  mapDBToAlbumsModel,
  mapDBToSongsModel,
  mapDBToDetailSongsModel,
  mapDBToPlaylistModel,
  mapDBToPlaylistActivityModel
}
