import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './stw_progress.js'

@customElement('stw-player')
export default class STWPlayer extends LitElement {
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

  render() {
    return html`
      <div class='player__track-infos'>
        <img class="player__track-cover" alt="cover"/>
        <div>
          <p class="player__track-title">Jules Vern on the moon</p>
          <p class="player__track-artist">Ad Hoc Wind Orchestra</p>
        </div>
      </div>
      <div class="player__controls-wrapper">
        <div class='player__controls'>
          <button class="player__repeat">
            <img src='/resources/assets/svg/repeat.svg' alt="repeat"/>
          </button>
          <button class="player__shuffle">
            <img src='/resources/assets/svg/shuffle.svg' alt="shuffle"/>
          </button>
          <button class="player__seek_backward">
            <img src='/resources/assets/svg/seek_backward.svg' alt="seek backward"/>
          </button>
          <button class="player__previous">
            <img src='/resources/assets/svg/previous.svg' alt="previous"/>
          </button>
          <button class="player__play">
            <img src='/resources/assets/svg/play.svg' alt="play"/>
          </button>
          <button class="player__next">
            <img src='/resources/assets/svg/next.svg' alt="next"/>
          </button>
          <button class="player__seek_forward">
            <img src='/resources/assets/svg/seek_forward.svg' alt="seek forward"/>
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
