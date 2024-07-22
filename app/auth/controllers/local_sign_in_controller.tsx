import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '../validators/local_auth.js'
import User from '#models/user'

import SignIn from '#views/pages/auth/sign_in'

export default class LocalSignInController {
  index() {
    return <SignIn />
  }

  async store({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // check credentials
    const user = await User.verifyCredentials(email, password)

    // check email is verified
    if (!user.emailVerified) {
      return response.unauthorized({
        message: 'Account not validated. Please verify your e-mails.',
      })
    }

    // login the user
    await auth.use('web').login(user)

    // redirect to home page if successful login
    return response.redirect().toRoute('home')
  }
}
