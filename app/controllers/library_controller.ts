import type { HttpContext } from '@adonisjs/core/http'
import Album from "#models/album";

export default class LibraryController {
  async getLibrary({ response, auth }: HttpContext) {
    // TODO set :page param and implement pagination on the front-end
    const albums = await Album.query()
      .whereNull('owner_id')
      .orWhere('owner_id', auth.user.id)
      .orderBy('year', 'desc')
      .paginate(1, 10)

    // use a presenter with ModelPaginatorContract
    return response.ok(albums)
  }
}
