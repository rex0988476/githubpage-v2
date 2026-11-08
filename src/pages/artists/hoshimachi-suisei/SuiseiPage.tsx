import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { artistImageUrl, collectionOf, daysSince, eventsOf } from '../../../lib/music'
import type { Artist } from '../../../types'
import { CollectionDialog, CollectionPreview } from '../shared/Collection'
import { EventRow } from '../shared/EventRow'
import { FanSinceProof } from '../shared/FanSinceProof'
import { SongRow } from '../shared/SongRow'
import { useEventFocus } from '../shared/useEventFocus'
import { useExpandableRows } from '../shared/useExpandableRows'
import { CometTrail } from './CometTrail'
import styles from './SuiseiPage.module.css'

export default function SuiseiPage({ artist }: { artist: Artist }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const events = eventsOf(artist.slug)
  const collection = collectionOf(artist.slug)
  const { playingId, openEventId, setOpenEventId, play, toggleEvent } = useExpandableRows()
  useEventFocus(events, openEventId, setOpenEventId)

  return (
    <div ref={rootRef} className={styles.page}>
      <Link className={styles.back} to="/music">
        ← Music
      </Link>
      <CometTrail rootRef={rootRef} />
      <CollectionDialog slug={artist.slug} items={collection} classes={styles} />

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
              <FanSinceProof proof={artist.fanSinceProof} className={styles.fanSince} classes={styles}>
                FAN SINCE <time dateTime={artist.fanSince}>{artist.fanSince.replaceAll('-', '.')}</time>
                <span>
                  喜歡了 <strong>{daysSince(artist.fanSince).toLocaleString('en-US')}</strong> 天
                </span>
              </FanSinceProof>
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
            <CollectionPreview slug={artist.slug} items={collection} classes={styles} />
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
          <p className={styles.label}>活動紀錄</p>
          <h2>EVENTS</h2>
          {events.length > 0 ? (
            <ul className={styles.events}>
              {events.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  open={event.id === openEventId}
                  onToggle={toggleEvent}
                  classes={styles}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>活動紀錄整理中</p>
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
