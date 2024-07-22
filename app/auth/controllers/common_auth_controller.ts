import type { HttpContext } from '@adonisjs/core/http'

export default class CommonAuthController {
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }
}
