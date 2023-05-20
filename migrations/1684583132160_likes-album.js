/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    album_id: {
      type: 'TEXT',
      notNull: true,
      references: 'albums',
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
