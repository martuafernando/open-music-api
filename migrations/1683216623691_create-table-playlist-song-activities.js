/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
    user_id: {
      type: 'TEXT',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    action: {
      type: 'TEXT',
      notNull: true
    },
    time: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities')
}
