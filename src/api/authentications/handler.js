const autoBind = require('auto-bind')

class AuthenticationsHandler {
  constructor ({ authenticationsService, userService, tokenManager }) {
    this._authenticationsService = authenticationsService
    this._usersService = userService
    this._tokenManager = tokenManager
    autoBind(this)
  }

  async postAuthentication (request, h) {
    const id = await this._usersService.verifyUserCredential(request.payload)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthentication (request, h) {
    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthentication (request, h) {
    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    }
  }
}

module.exports = AuthenticationsHandler
