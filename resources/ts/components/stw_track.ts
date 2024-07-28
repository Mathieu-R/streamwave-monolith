import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import player from '../store/player/signals.js'
import { setTracklist, setCurrentTrack } from '#ts/store/player/mutations'
import type { Track } from '#types/signals'

@customElement('stw-track')
export default class STWTrack extends LitElement {
  @property() index!: number
  @property() trackid!: number
  @property() title!: string
  @property() artist!: string
  @property() number!: number
  @property() coverUrl!: string
  @property() duration!: number
  @property() manifest!: string
  @property() playlist!: string
  @property() audio128!: string
  @property() audio192!: string
  @property() audio256!: string

  get tracklistId() {
    // stw-track should always be in a stw-tracklist element
    return document.querySelector('stw-tracklist')!.getAttribute('tracklistid')!
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', this.launchTrack)
  }

  launchTrack() {
    // check if we need to update the tracklist
    if (this.tracklistId !== player.tracklistId.value) {
      // update the tracklist
      const tracklist = document.querySelector('stw-tracklist')!
      const tracklistMap = new Map(
        Array.from(tracklist.querySelectorAll('stw-track'))!.map((track) => {
          const trackInfos = {
            index: Number.parseInt(track.getAttribute('index')!),
            title: track.getAttribute('title')!,
            artist: track.getAttribute('artist')!,
            duration: Number.parseInt(track.getAttribute('duration')!),
            coverUrl: track.getAttribute('coverUrl')!,
            manifest: track.getAttribute('manifest')!,
            playlist: track.getAttribute('playlist')!,
          } as Track

          return [Number.parseInt(track.getAttribute('trackid')!), trackInfos]
        })
      )

      setTracklist(tracklistMap, this.tracklistId)
    }

    // set the current track
    setCurrentTrack(this.index)
  }

  render() {
    return html` <slot></slot>`
  }
}
