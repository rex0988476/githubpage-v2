import { useRef, type ReactNode } from 'react'
import type { FavoriteSong } from '../../../types'

interface SongRowProps {
  song: FavoriteSong
  creditLabel?: string
  playing: boolean
  onPlay: (videoId: string, row: HTMLElement) => void
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
  playLabel?: ReactNode
}

export function SongRow({ song, creditLabel, playing, onPlay, classes, playLabel = '▶ 播放' }: SongRowProps) {
  const rowRef = useRef<HTMLLIElement>(null)

  return (
    <li ref={rowRef} className={classes.song}>
      <div className={classes.songLine}>
        <div>
          <h4 lang="ja">{song.title}</h4>
          <p className={classes.meta}>
            {song.year}
            {song.credit && (
              <>
                {' · '}
                {creditLabel && `${creditLabel} `}
                <span lang="ja">{song.credit}</span>
              </>
            )}
          </p>
        </div>
        {!playing && (
          <button
            type="button"
            className={classes.play}
            onClick={() => {
              if (rowRef.current) onPlay(song.videoId, rowRef.current)
            }}
          >
            {playLabel}
          </button>
        )}
      </div>
      {playing && (
        <iframe
          className={classes.video}
          src={`https://www.youtube-nocookie.com/embed/${song.videoId}?autoplay=1`}
          title={`${song.title} 影片`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
    </li>
  )
}
