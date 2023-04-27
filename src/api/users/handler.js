const autoBind = require('auto-bind')

class UsersHandler {
  constructor (service) {
    this._service = service
    autoBind(this)
  }

  async postUsers (request, h) {
    const userId = await this._service.addUser(request.payload)

    return h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId
        }
      })
      .code(201)
  }
}

module.exports = UsersHandler
