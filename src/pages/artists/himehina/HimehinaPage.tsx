import '@fontsource/fredoka/latin-700.css'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { artistImageUrl, collectionOf, daysSince, eventsOf } from '../../../lib/music'
import type { Artist, FavoriteSong } from '../../../types'
import { CollectionDialog, CollectionPreview } from '../shared/Collection'
import { EventRow } from '../shared/EventRow'
import { SongRow } from '../shared/SongRow'
import { useEventFocus } from '../shared/useEventFocus'
import { useExpandableRows } from '../shared/useExpandableRows'
import { Carrot } from './Carrot'
import styles from './HimehinaPage.module.css'
import { RibbonTrail } from './RibbonTrail'
import { WaxSeal } from './WaxSeal'

const playLabel = (
  <>
    <Carrot className={styles.playCarrot} /> 播放
  </>
)

interface SongColumnProps {
  title: string
  songs: FavoriteSong[]
  creditLabel?: string
  playingId: string | null
  onPlay: (videoId: string, row: HTMLElement) => void
}

function SongColumn({ title, songs, creditLabel, playingId, onPlay }: SongColumnProps) {
  if (songs.length === 0) return null

  return (
    <div>
      <h3 className={styles.columnTitle}>{title}</h3>
      <ul className={styles.songs} data-scroller>
        {songs.map((song) => (
          <SongRow
            key={song.videoId}
            song={song}
            creditLabel={creditLabel}
            playing={song.videoId === playingId}
            onPlay={onPlay}
            classes={styles}
            playLabel={playLabel}
          />
        ))}
      </ul>
    </div>
  )
}

export default function HimehinaPage({ artist }: { artist: Artist }) {
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
      <RibbonTrail rootRef={rootRef} />
      <CollectionDialog slug={artist.slug} items={collection} classes={styles} />

      <section className={styles.cover}>
        <div className={styles.coverSheet} data-sheet>
          <div className={styles.photoFrame}>
            {artist.image ? (
              <img src={artistImageUrl(artist.image)} alt={artist.name} />
            ) : (
              <div className={styles.photoEmpty}>形象照片待補</div>
            )}
          </div>
          <div className={styles.coverText}>
            <h1>
              <span className={styles.hime}>{artist.name.slice(0, 4)}</span>
              <span className={styles.hina}>{artist.name.slice(4)}</span>
            </h1>
            <div className={styles.coverMeta}>
              <a className={styles.youtube} href={artist.youtube} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 28 20" aria-hidden="true">
                  <rect width="28" height="20" rx="5.5" fill="#f00" />
                  <path d="M11.2 5.7v8.6l7.4-4.3z" fill="#fff" />
                </svg>
                YouTube
              </a>
              {artist.fanSince && (
                <p className={styles.stamp}>
                  <small>FAN SINCE</small>
                  <time dateTime={artist.fanSince}>{artist.fanSince.replaceAll('-', '.')}</time>
                  <span>
                    喜歡了 <strong>{daysSince(artist.fanSince).toLocaleString('en-US')}</strong> 天
                  </span>
                </p>
              )}
            </div>
          </div>
          <Carrot className={styles.coverCarrot} />
        </div>
      </section>

      {(artist.story.length > 0 || collection.length > 0) && (
        <section className={styles.pink}>
          <div className={`${styles.sheet} ${styles.grid}`} data-sheet>
            <p className={styles.tape}>我眼中的 HIMEHINA</p>
            <h2 className={styles.titleRed}>STORY</h2>
            {artist.story.length > 0 && (
              <>
                <div className={styles.storyText}>
                  {artist.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <WaxSeal />
              </>
            )}
            <CollectionPreview slug={artist.slug} items={collection} classes={styles} />
          </div>
        </section>
      )}

      <section className={styles.yellow}>
        <div className={`${styles.sheet} ${styles.grid}`} data-sheet>
          <p className={styles.tape}>喜歡的歌</p>
          <h2 className={styles.titleBlue}>SONGS</h2>
          <div className={styles.songColumns}>
            <SongColumn
              title="ORIGINAL"
              songs={artist.favoriteSongs}
              playingId={playingId}
              onPlay={play}
            />
            <SongColumn
              title="COVER"
              songs={artist.coverSongs}
              creditLabel="原曲"
              playingId={playingId}
              onPlay={play}
            />
          </div>
        </div>
      </section>

      <section className={styles.pink}>
        <div className={`${styles.sheet} ${styles.grid}`} data-sheet>
          <p className={styles.tape}>活動紀錄</p>
          <h2 className={styles.titleRed}>EVENTS</h2>
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

      <section className={styles.yellow}>
        <footer className={`${styles.sheet} ${styles.grid} ${styles.footer}`} data-sheet>
          <Link to="/music">← 回到 Music</Link>
          <p>個人粉絲頁，與本人及官方無關。影片來自官方 YouTube 頻道，作品權利屬於各權利人。</p>
        </footer>
      </section>
    </div>
  )
}
