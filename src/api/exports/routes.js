const routes = (handler, ExportPlaylistsPayloadSchema) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylists,
    options: {
      auth: 'jwt_authorization',
      validate: {
        payload: ExportPlaylistsPayloadSchema,
        failAction: async (request, h, err) => {
          err.output.payload.status = 'fail'
          throw err
        }
      }
    }
  }
]

module.exports = routes
