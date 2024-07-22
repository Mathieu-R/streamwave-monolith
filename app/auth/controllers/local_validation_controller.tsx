import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LocalAuthService from '../services/local_auth_service.js'
import { tokenValidator } from '../validators/local_auth.js'
import User, { Provider } from '#models/user'
import { DateTime } from 'luxon'
import env from '#start/env'

export default class LocalValidationController {
  @inject()
  async execute({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const qs = request.qs()
    const { token } = await tokenValidator.validate(qs)

    // check if token is still valid
    const user = await User.query()
      .where((query) => {
        return query
          .where('provider', Provider.LOCAL)
          .where('emailVerificationToken', token)
          .where('emailVerificationTokenExpiredAt', '>', DateTime.now().toSQLDate())
      })
      .first()

    // token does not exist or is expired
    if (!user) {
      return response.unauthorized('This account verification token does not exist or is expired.')
    }

    await localAuthService.validateAccount(user)

    const url =
      env.get('NODE_ENV') === 'production'
        ? 'https://www.streamwave.be/auth/login'
        : `http://localhost:${env.get('FRONT_PORT_DEV')}/auth/login`
    return response.redirect(url)
  }
}
