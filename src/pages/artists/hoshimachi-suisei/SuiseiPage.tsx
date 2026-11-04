import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { artistImageUrl, concertsOf, isUpcoming } from '../../../lib/music'
import type { Artist, FavoriteSong } from '../../../types'
import { CometTrail } from './CometTrail'
import styles from './SuiseiPage.module.css'

interface SongRowProps {
  song: FavoriteSong
  creditLabel?: string
  playing: boolean
  onPlay: (videoId: string, row: HTMLElement) => void
}

function SongRow({ song, creditLabel, playing, onPlay }: SongRowProps) {
  const rowRef = useRef<HTMLLIElement>(null)

  return (
    <li ref={rowRef} className={styles.song}>
      <div className={styles.songLine}>
        <div>
          <h4 lang="ja">{song.title}</h4>
          <p className={styles.meta}>
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
            className={styles.play}
            onClick={() => {
              if (rowRef.current) onPlay(song.videoId, rowRef.current)
            }}
          >
            ▶ 播放
          </button>
        )}
      </div>
      {playing && (
        <iframe
          className={styles.video}
          src={`https://www.youtube-nocookie.com/embed/${song.videoId}?autoplay=1`}
          title={`${song.title} 影片`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
    </li>
  )
}

export default function SuiseiPage({ artist }: { artist: Artist }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const concerts = concertsOf(artist.slug)
  const [playingId, setPlayingId] = useState<string | null>(null)

  // 收起上方的影片會讓版面上移，補回捲動量讓點擊的那一列留在原位
  const play = (videoId: string, row: HTMLElement) => {
    const top = row.getBoundingClientRect().top
    flushSync(() => setPlayingId(videoId))
    window.scrollBy({ top: row.getBoundingClientRect().top - top, behavior: 'instant' })
  }

  return (
    <div ref={rootRef} className={styles.page}>
      <Link className={styles.back} to="/music">
        ← Music
      </Link>
      <CometTrail rootRef={rootRef} />

      <section className={styles.hero} data-act data-side="right" data-trail="#7fd4ff">
        <div className={styles.heroInner}>
          {artist.image ? (
            <img className={styles.photo} src={artistImageUrl(artist.image)} alt={artist.name} />
          ) : (
            <div className={styles.photoEmpty}>形象照片待補</div>
          )}
          <div>
            <div className={styles.nameLine}>
              <h1 lang="ja">{artist.name}</h1>
              <a
                className={styles.youtube}
                href={artist.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label={`${artist.name} 的 YouTube 頻道`}
              >
                <svg viewBox="0 0 28 20" aria-hidden="true">
                  <rect width="28" height="20" rx="5.5" fill="#f00" />
                  <path d="M11.2 5.7v8.6l7.4-4.3z" fill="#fff" />
                </svg>
              </a>
            </div>
            <span className={styles.spark} data-spark aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className={styles.ghost} data-act data-side="left" data-trail="#fd8f42">
        <div className={styles.inner}>
          <p className={styles.label}>喜歡的歌</p>
          <h2>SONGS</h2>
          <div className={styles.songColumns}>
            <div>
              <h3 className={styles.columnTitle}>ORIGINAL</h3>
              <ul className={styles.songs}>
                {artist.favoriteSongs.map((song) => (
                  <SongRow
                    key={song.videoId}
                    song={song}
                    playing={song.videoId === playingId}
                    onPlay={play}
                  />
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.columnTitle}>COVER</h3>
              <ul className={styles.songs}>
                {artist.coverSongs.map((song) => (
                  <SongRow
                    key={song.videoId}
                    song={song}
                    creditLabel="原曲"
                    playing={song.videoId === playingId}
                    onPlay={play}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.nova} data-act data-nova data-side="right" data-trail="#ffffff">
        <div className={styles.burst} aria-hidden="true" />
        <div className={styles.inner}>
          <p className={styles.label}>演唱會參戰紀錄</p>
          <h2>LIVE</h2>
          {concerts.length > 0 ? (
            <ul className={styles.concerts}>
              {concerts.map(({ id, date, title, venue, city }) => (
                <li key={id}>
                  <time dateTime={date}>{date.replaceAll('-', '.')}</time>
                  {isUpcoming(date) && <span className={styles.upcoming}>即將參戰</span>}
                  <h3>{title}</h3>
                  <p>{[venue, city].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>參戰紀錄整理中</p>
          )}
        </div>
      </section>

      <section className={styles.onward} data-act data-side="left" data-trail="#7fd4ff">
        <footer className={styles.inner}>
          <Link to="/music">← 回到 Music</Link>
          <p>個人粉絲頁，與本人及官方無關。影片來自官方 YouTube 頻道，作品權利屬於各權利人。</p>
        </footer>
      </section>
    </div>
  )
}
