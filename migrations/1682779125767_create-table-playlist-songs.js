/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'TEXT',
      notNull: true,
      references: 'playlists',
      onDelete: 'CASCADE'
    },
    song_id: {
      type: 'TEXT',
      notNull: true,
      references: 'songs',
      onDelete: 'CASCADE'
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs')
}
