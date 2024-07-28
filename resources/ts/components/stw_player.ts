import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { SignalWatcher } from '@lit-labs/preact-signals'
// @ts-expect-error
import shaka from 'shaka-player'

import player from '../store/player/signals.js'
import { setCurrentTime, switchPlayingStatus } from '../store/player/mutations.js'

import Constants from '../constants.js'

import './stw_progress.js'
import { Track } from '#types/signals'

@customElement('stw-player')
export default class STWPlayer extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 25% 1fr 25%;
      gap: 20px;
      padding: 15px;
      background: #000;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
    }

    .player__track-infos {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
    }

    .player__track-cover {
      height: 84px;
      width: 84px;
    }

    .player__track-title {
      margin: 5px 0;
    }

    .player__track-artist {
      margin: 0;
      font-size: 14px;
      color: var(--color-surface-700);
    }

    .player__controls-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .player__controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .player__shuffle img,
    .player__repeat img {
      width: 24px;
      height: 24px;
    }

    .player__play img {
      width: 42px;
      height: 42px;
    }

    .player__aside-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  `

  @property({ type: String })
  cdn!: string

  @property({ type: Object })
  player: shaka.Player | null

  @property({ type: Object })
  castProxy: shaka.cast.CastProxy | null

  @property({ type: Object })
  remoteAudio: HTMLAudioElement | null

  @property({ type: Object })
  remotePlayer: shaka.Player | null

  @property({ type: Boolean })
  tracking: boolean

  @property()
  audio: HTMLAudioElement

  @state()
  currentTrack: Track | null

  constructor() {
    super()

    this.player = null
    this.castProxy = null

    this.remoteAudio = null
    this.remotePlayer = null

    this.currentTrack = null
    this.tracking = false
    this.audio = document.querySelector('.audio')!

    this.trackTimeUpdate = this.trackTimeUpdate.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()

    this.initShakaPlayer().then(() => {
      this.addEventListeners()
    })

    // listen to queue pointer index changes
    player.queuePointerIndex.subscribe((pointer) => {
      // pointer is null => no track set for listening
      // however, this is the default value, so I guess the callback should never fire with null value
      if (!pointer) {
        return
      }

      const queue = player.queue.value
      const trackId = queue[pointer]
      const track = player.tracklist.value!.get(trackId)!

      this.listen(track, true)
        .then(() => {
          this.currentTrack = track
        })
        .catch((err: Error) => {
          this.player!.unload()
          console.error(err)
        })
    })
  }

  addEventListeners() {
    this.audio.addEventListener('play', () => {
      // start time tracking
      requestAnimationFrame(this.trackTimeUpdate)
    })

    this.audio.addEventListener('pause', () => {
      // stop time tracking
      this.tracking = false
    })

    this.audio.addEventListener('ended', (e) => {
      console.log(e)
    })

    // changing track
    this.audio.addEventListener('durationchange', (e) => {
      console.log(e)
    })
  }

  async initShakaPlayer() {
    shaka.polyfill.installAll()

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...')
      return
    }

    this.player = new shaka.Player()
    await this.player.attach(this.audio)

    this.castProxy = new shaka.cast.CastProxy(this.audio, this.player, Constants.PRESENTATION_ID)
    this.remoteAudio = this.castProxy.getVideo()
    this.remotePlayer = this.castProxy.getPlayer()

    // player accessible anywhere
    // @ts-expect-error
    window.player = this.player

    // player event listeners
    this.playerEventListeners()
  }

  playerEventListeners() {
    this.player.addEventListener('error', (evt: any) => {
      console.error('Shaka player error')
      evt.detail.map((err: Error) => console.error(err))
    })
  }

  initWebAudioApi() {}

  async listen(track: Track, play: boolean) {
    if (!this.remotePlayer) {
      return
    }

    await this.remotePlayer.load(`${this.cdn}/${track.manifest}`)

    console.log(`[shaka-player] Music loaded: ${track.manifest}`)
    return play ? await this.play() : await this.pause()

    // TODO: media session notification
  }

  play() {
    this.remoteAudio?.play()
  }

  pause() {
    this.remoteAudio?.pause()
  }

  seek(time: number) {
    this.remoteAudio!.currentTime = time
  }

  onPlayPauseClick() {
    const isPlaying = player.status.playing.value

    // switch playing status
    switchPlayingStatus()

    isPlaying ? this.pause() : this.play()
  }

  onPrevClick() {
    const currentTime = this.audio!.currentTime

    // if media has been listened for more than 2 seconds, go back to the beginning
    if (currentTime > 2) {
      this.seek(0)
      return
    }
  }

  trackTimeUpdate() {
    if (this.tracking) {
      return
    }

    // recursively call this function for 60fps track time update
    requestAnimationFrame(this.trackTimeUpdate)

    // update current time signal
    const { currentTime } = this.audio
    setCurrentTime(currentTime)
  }

  renderPlayPause() {
    return player.status.playing.value
      ? html`<img src="/resources/assets/svg/pause.svg" alt="pause" />`
      : html`<img src="/resources/assets/svg/play.svg" alt="play" />`
  }

  render() {
    console.log('rendering')
    return html`
      <div class='player__track-infos'>
        <img class="player__track-cover" src=${this.cdn}/${ifDefined(this.currentTrack?.coverUrl)} alt="cover"/>
        <div>
          <p class="player__track-title">${this.currentTrack?.title}</p>
          <p class="player__track-artist">${this.currentTrack?.artist}</p>
        </div>
      </div>
      <div class="player__controls-wrapper">
        <div class='player__controls'>
          <button class="player__shuffle">
            <img src='/resources/assets/svg/shuffle.svg' alt="shuffle"/>
          </button>
          <button class="player__seek_backward">
            <img src='/resources/assets/svg/seek_backward.svg' alt="seek backward"/>
          </button>
          <button class="player__previous" @click="${this.onPrevClick}">
            <img src='/resources/assets/svg/previous.svg' alt="previous"/>
          </button>
          <button class="player__play" @click="${this.onPlayPauseClick}">
            ${this.renderPlayPause()}
          </button>
          <button class="player__next">
            <img src='/resources/assets/svg/next.svg' alt="next"/>
          </button>
          <button class="player__seek_forward">
            <img src='/resources/assets/svg/seek_forward.svg' alt="seek forward"/>
          </button>
          <button class="player__repeat">
            <img src='/resources/assets/svg/repeat.svg' alt="repeat"/>
          </button>
        </div>
        <stw-progress class='player__progress-bar progress-bar'></stw-progress>
      </div>
      </div>
      <div class='player__aside-wrapper'>
        <button class="player__chromecast">
          <img src='/resources/assets/svg/cast.svg' alt="chromecast"/>
        </button>
        <stw-volume class="player__volume"></stw-volume>
      </div>
    `
  }
}
