import player from '#ts/store/player/signals'
import { Track } from '#types/signals'

export const setTracklist = (tracklist: Map<number, Track>, id: string) => {
  const queue = Array.from(tracklist.keys())

  player.tracklist.value = tracklist
  player.tracklistId.value = id
  player.queue.value = queue
}

export const setCurrentTrack = (queuePointerIndex: number) => {
  const queue = player.queue.value
  if (queue.length === 0) {
    console.error('ERROR: queue is empty...')
  }

  // O(1)
  player.queuePointerIndex.value = queuePointerIndex

  // activate player
  player.active.value = true

  // set playing status
  player.status.playing.value = true
}

export const switchPlayingStatus = () => {
  const playing = player.status.playing
  playing.value = !playing.value
}

export const setCurrentTime = (currentTime: number) => {
  player.currentTime.value = currentTime
}
