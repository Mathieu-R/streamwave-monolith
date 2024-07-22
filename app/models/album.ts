import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Album extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare artist: string

  @column()
  declare title: string

  @column()
  declare year: number

  @column()
  declare genre: string

  @column()
  declare cover_url: string

  @column()
  declare primary_color_r: number

  @column()
  declare primary_color_g: number

  @column()
  declare primary_color_b: number

  @column()
  declare owner_id: number | null

  @belongsTo(() => User)
  declare User: BelongsTo<typeof User> | null
}
