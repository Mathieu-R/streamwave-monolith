import {BaseModel, belongsTo, column, manyToMany} from '@adonisjs/lucid/orm'
import type {BelongsTo, ManyToMany} from "@adonisjs/lucid/types/relations";
import Album from "#models/album";
import Playlist from "#models/playlist";

export default class Track extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare number: number

  @column()
  declare title: string

  @column()
  declare artist: string

  @column()
  declare duration: number

  @column()
  declare manifest_url: string

  @column()
  declare playlist_hls_url: string

  @column()
  declare audio_128_url: string

  @column()
  declare audio_192_url: string

  @column()
  declare audio_256_url: string

  @column()
  declare album_id: number

  @belongsTo(() => Album)
  declare album: BelongsTo<typeof Album>

  @manyToMany(() => Playlist)
  declare playlists: ManyToMany<typeof Playlist>
}
