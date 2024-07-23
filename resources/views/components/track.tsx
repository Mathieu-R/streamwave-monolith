import { formatDuration } from '#start/view'

interface Props {
  track: any
  type: string
}

export default function Track(props: Props) {
  const { track, type } = props
  return (
    <stw-track
      class={'track'}
      data-id={track.id}
      data-title={track.title}
      data-artist={track.artist}
      data-number={track.number}
      data-duration={track.duration}
      data-manifest={track.manifestUrl}
      data-playlist={track.playlistUrl}
      data-audio128={track.audio128Url}
      data-audio192={track.audio192Url}
      data-audio256={track.audio256Url}
    >
      <div class="track__number">{track.number}</div>
      <div class="track__title">{track.title}</div>
      <div class="track__duration">{formatDuration(track.duration)}</div>
      {type === 'playlist' && <button class="track__remove"></button>}
    </stw-track>
  )
}
