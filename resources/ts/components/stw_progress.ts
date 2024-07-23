import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('stw-progress')
export default class STWProgress extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      --progress-bar-height: 5px;
    }

    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
    }

    .progress-bar {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      border-radius: 5px;
    }

    .progress-bar__track {
      position: absolute;
      top: 50%;
      left: 50%;
      height: var(--progress-bar-height);
      width: 100%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.5);
    }

    .progress-bar__track-used {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: var(--progress-bar-height);
      background: #fff;
      border-radius: 5px;
      transform: translate(-50%, -50%) scale(0);
      transform-origin: 0 50%;
      will-change: transform;
    }

    .progress-bar__seeker-container {
      position: relative;
      width: 100%;
      background: 0 0;
      border: none;
      outline: none;
      pointer-events: none;
    }

    .progress-bar__seeker {
      position: absolute;
      top: 50%;
      left: -5px;
      height: 20px;
      width: 20px;
      outline: 0;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      transform: translateY(-50%) scale(0.9);
      transition: transform 0.2s cubic-bezier(0, 0, 0.3, 1);
      will-change: transform;
    }

    .progress-bar__seeker--active {
      box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1);
    }
  `
  private bcr: null | DOMRect
  private dragging: boolean
  private clampedPosition: null | number

  constructor() {
    super()

    this.bcr = null
    this.dragging = false
    this.clampedPosition = null

    this.onResize = this.onResize.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.onSwipeStart = this.onSwipeStart.bind(this)
    this.onSwipeMove = this.onSwipeMove.bind(this)
    this.onSwipeEnd = this.onSwipeEnd.bind(this)
  }

  // reference to the progress bar element
  // because we need to know its BCR properties
  // strangely @query doesn't work
  get _progressBar() {
    return this.renderRoot?.querySelector('.progress-bar') ?? null
  }

  get _trackUsed() {
    return this.renderRoot?.querySelector('.progress-bar__track-used') ?? null
  }

  get _seekerContainer() {
    return this.renderRoot?.querySelector('.progress-bar__seeker-container') ?? null
  }

  get _seeker() {
    return this.renderRoot?.querySelector('.progress-bar__seeker') ?? null
  }

  connectedCallback() {
    super.connectedCallback()

    document.addEventListener('touchmove', this.onSwipeMove, { passive: true })
    document.addEventListener('touchend', this.onSwipeEnd, { passive: true })
    document.addEventListener('mousemove', this.onSwipeMove, { passive: true })
    document.addEventListener('mouseup', this.onSwipeEnd, { passive: true })
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  onResize() {
    // TODO: this is null on first render and not null when moving the window to trigger the resize event
    if (!this._progressBar) {
      return
    }

    this.bcr = this._progressBar.getBoundingClientRect()
  }

  findCandidate(evt: TouchEvent) {
    if (evt.touches && evt.touches.length) {
      return evt.touches[0]
    }

    if (evt.changedTouches && evt.changedTouches.length) {
      return evt.changedTouches[0]
    }

    return evt
  }

  onSwipeStart(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    // focus on seeker element
    this._seekerContainer!.focus()
    this.dragging = true
    this._seeker!.classList.add('progress-bar__seeker--active')
  }

  onSwipeMove(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    if (!this.dragging) {
      return
    }

    this.updatePosition(evt)
  }

  onSwipeEnd(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    if (!this.dragging) {
      return
    }

    this.dragging = false
    this._seeker!.classList.remove('progress-bar__seeker--active')

    const currentTime = this.updatePosition(evt)
    // TODO: seek the audio to the new position (dispatch event)
  }

  updatePosition(evt: TouchEvent | MouseEvent) {
    if (!this.bcr) {
      return
    }

    const positionX = this.findCandidate(evt).pageX
    const relativePositionX = (positionX - this.bcr.left) / this.bcr.width
    // ensure we do not go outside the progress bar
    const clampedPositionX = Math.max(0, Math.min(relativePositionX, 1))

    // TODO: get the current time from the clamped position

    requestAnimationFrame(() => this.updateUI(clampedPositionX))
  }

  updateUI(clampedPositionX: number) {
    this._trackUsed!.style.transform = `translate(-50%, -50%) scale(${clampedPositionX})`
    this._seekerContainer!.style.transform = `translateX(${clampedPositionX * 100}%)`
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('touchmove', this.onSwipeMove)
    document.removeEventListener('touchend', this.onSwipeEnd)
    document.removeEventListener('mousemove', this.onSwipeMove)
    document.removeEventListener('mouseup', this.onSwipeEnd)
    window.removeEventListener('resize', this.onResize)
  }

  protected render() {
    return html`
      <div class="wrapper" @mousedown="${this.onSwipeStart}" @touchstart="${this.onSwipeStart}">
        <div class="player__current_time"></div>
        <div class="progress-bar">
          <div class="progress-bar__track"></div>
          <div class="progress-bar__track-used"></div>
          <div class="progress-bar__seeker-container">
            <div class="progress-bar__seeker"></div>
          </div>
        </div>
        <div class="player__total_time"></div>
      </div>
    `
  }
}
