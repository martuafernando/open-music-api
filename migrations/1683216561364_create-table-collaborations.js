/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
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
    user_id: {
      type: 'TEXT',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('collaborations')
}
