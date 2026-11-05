import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { artistImageUrl, concertsOf, daysSince } from '../../../lib/music'
import type { Artist } from '../../../types'
import { ConcertRow } from '../shared/ConcertRow'
import { PhotoGallery } from '../shared/PhotoGallery'
import { SongRow } from '../shared/SongRow'
import { useExpandableRows } from '../shared/useExpandableRows'
import { CometTrail } from './CometTrail'
import styles from './SuiseiPage.module.css'

export default function SuiseiPage({ artist }: { artist: Artist }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const concerts = concertsOf(artist.slug)
  const { playingId, openConcertId, play, toggleConcert } = useExpandableRows()

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
            {artist.fanSince && (
              <p className={styles.fanSince}>
                FAN SINCE <time dateTime={artist.fanSince}>{artist.fanSince.replaceAll('-', '.')}</time>
                <span>
                  喜歡了 <strong>{daysSince(artist.fanSince).toLocaleString('en-US')}</strong> 天
                </span>
              </p>
            )}
            <span className={styles.spark} data-spark aria-hidden="true" />
          </div>
        </div>
      </section>

      {artist.story.length > 0 && (
        <section className={styles.story} data-act data-side="left" data-trail="#74727b">
          <div className={styles.inner}>
            <p className={styles.label}>我眼中的星街</p>
            <h2>STORY</h2>
            <div className={styles.storyText}>
              {artist.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {artist.gallery.length > 0 && <PhotoGallery photos={artist.gallery} title="COLLECTION" classes={styles} />}
          </div>
        </section>
      )}

      <section className={styles.ghost} data-act data-side="right" data-trail="#fd8f42">
        <div className={styles.inner}>
          <p className={styles.label}>喜歡的歌</p>
          <h2>SONGS</h2>
          <div className={styles.songColumns}>
            <div>
              <h3 className={styles.columnTitle}>ORIGINAL</h3>
              <ul className={styles.songs} data-scroller>
                {artist.favoriteSongs.map((song) => (
                  <SongRow
                    key={song.videoId}
                    song={song}
                    playing={song.videoId === playingId}
                    onPlay={play}
                    classes={styles}
                  />
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.columnTitle}>COVER</h3>
              <ul className={styles.songs} data-scroller>
                {artist.coverSongs.map((song) => (
                  <SongRow
                    key={song.videoId}
                    song={song}
                    creditLabel="原曲"
                    playing={song.videoId === playingId}
                    onPlay={play}
                    classes={styles}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.nova} data-act data-nova data-side="left" data-trail="#ffffff">
        <div className={styles.burst} aria-hidden="true" />
        <div className={styles.inner}>
          <p className={styles.label}>演唱會參戰紀錄</p>
          <h2>LIVE</h2>
          {concerts.length > 0 ? (
            <ul className={styles.concerts}>
              {concerts.map((concert) => (
                <ConcertRow
                  key={concert.id}
                  concert={concert}
                  open={concert.id === openConcertId}
                  onToggle={toggleConcert}
                  classes={styles}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>參戰紀錄整理中</p>
          )}
        </div>
      </section>

      <section className={styles.onward} data-act data-side="right" data-trail="#7fd4ff">
        <footer className={styles.inner}>
          <Link to="/music">← 回到 Music</Link>
          <p>個人粉絲頁，與本人及官方無關。影片來自官方 YouTube 頻道（Pieces 沒有官方影片，使用粉絲製作的 MV），作品權利屬於各權利人。</p>
        </footer>
      </section>
    </div>
  )
}
