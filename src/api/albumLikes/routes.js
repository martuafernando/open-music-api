const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikeAlbum,
    options: {
      auth: 'jwt_authorization'
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteLikeAlbum,
    options: {
      auth: 'jwt_authorization'
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getLikeAlbum
  }
]

module.exports = routes
