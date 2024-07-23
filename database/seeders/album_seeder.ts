import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Album from '#models/album'

// @ts-expect-error
import colorthief from 'colorthief'
import { parse } from 'csv-parse/sync'
import fs from 'node:fs/promises'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    console.log('SEEDING DATABASE...')
    const folders = await fs.readdir('data')

    for (const folder of folders) {
      console.log(`Album: '${folder}'`)
      const csv = await fs.readFile(`data/${folder}/metadata.csv`, 'utf-8')
      const metadata = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
      })

      // get most dominant color from album cover
      const coverUrl = metadata[0]['cover_url']
      const [primaryColorR, primaryColorG, primaryColorB] = await colorthief.getColor(
        `data/${coverUrl}`
      )

      // create album
      const album = await Album.create({
        artist: metadata[0]['album_artist'],
        title: metadata[0]['album'],
        year: Number.parseInt(metadata[0]['year']),
        genre: metadata[0]['genre'],
        coverUrl: coverUrl,
        primaryColorR: primaryColorR,
        primaryColorG: primaryColorG,
        primaryColorB: primaryColorB,
      })

      album.related('tracks').createMany(
        metadata.map((m: any) => {
          return {
            number: m['track_number'],
            title: m['title'],
            artist: m['artist'],
            duration: Number.parseInt(m['duration']),
            manifestUrl: m['manifest_url'],
            playlistUrl: m['playlist_url'],
            audio128Url: m['audio128_url'],
            audio192Url: m['audio192_url'],
            audio256Url: m['audio256_url'],
          }
        })
      )
    }
  }
}
