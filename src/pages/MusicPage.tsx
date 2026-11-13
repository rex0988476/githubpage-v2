import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/PageTitle'
import { artists } from '../data/music/artists'
import { concertTimeline } from '../lib/music'
import type { ArtistEvent } from '../types'

/** 每張拍立得歪的角度，用 slug 算出來，重新整理也不會變 */
function tilt(slug: string) {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return `${((hash % 7) - 3) * 0.8}deg`
}

/** 演唱會票根：左邊是日期存根，右邊是場次，點了跳到該音樂家頁的那一場 */
function ConcertTicket({ event, upcoming }: { event: ArtistEvent; upcoming: boolean }) {
  const performers = event.artistSlugs
    .map((slug) => artists.find((artist) => artist.slug === slug))
    .filter((artist) => artist !== undefined)
  const [year, month, day] = event.date.split('-')

  return (
    <li style={{ '--artist-accent': performers[0]?.accent ?? 'var(--lavender)' } as CSSProperties}>
      <Link
        to={`/music/artists/${event.artistSlugs[0]}`}
        state={{ focusEvent: event.id }}
        className="ticket"
      >
        <time className="ticket-stub" dateTime={event.date}>
          <span className="ticket-day">
            {month}.{day}
          </span>
          <span className="ticket-year">{year}</span>
        </time>
        <span className="ticket-body">
          {upcoming && <span className="ticket-upcoming">即將參戰</span>}
          <span className="ticket-title">{event.title}</span>
          {event.subtitle && <span className="ticket-place">{event.subtitle}</span>}
          <span className="ticket-artists" lang="ja">
            {performers.map((artist) => artist.name).join(' · ')}
          </span>
        </span>
      </Link>
    </li>
  )
}

export function MusicPage() {
  const { upcoming, past } = concertTimeline()

  return (
    <div className="paper-page">
      <PageTitle title="My Music" emoji="🎧" tone="--lavender-soft" tape="pink" />
      {upcoming.length + past.length > 0 && (
        <section className="music-body music-section" aria-labelledby="music-concerts">
          <h2 id="music-concerts">
            <span className="marker">Concerts</span>
            <small>{past.length} attended</small>
          </h2>
          <ul className="ticket-list">
            {[...upcoming, ...past].map((event, i, all) => {
              const year = event.date.slice(0, 4)
              return (
                <Fragment key={event.id}>
                  <ConcertTicket event={event} upcoming={i < upcoming.length} />
                  {/* 由下往上讀：年份標在那一年最早一場的下面 */}
                  {year !== all[i + 1]?.date.slice(0, 4) && (
                    <li className="timeline-year" aria-hidden="true">
                      {year}
                    </li>
                  )}
                </Fragment>
              )
            })}
          </ul>
        </section>
      )}
      <section className="music-body music-section" aria-labelledby="music-artists">
        <h2 id="music-artists">
          <span className="marker">Artists</span>
          <small>{artists.length}</small>
        </h2>
        <ul className="artist-wall">
          {artists.map(({ slug, name, accent, image, fanSince }) => (
            <li key={slug}>
              <Link
                to={`/music/artists/${slug}`}
                className="polaroid"
                style={{ '--artist-accent': accent, '--tilt': tilt(slug) } as CSSProperties}
              >
                <span className="polaroid-photo">
                  {image ? (
                    <img
                      src={`${import.meta.env.BASE_URL}artists/${image}`}
                      alt=""
                      width={400}
                      height={400}
                      loading="lazy"
                    />
                  ) : (
                    <span className="polaroid-initial" lang="ja">
                      {name.slice(0, 1)}
                    </span>
                  )}
                </span>
                <span className="polaroid-name" lang="ja">
                  {name}
                </span>
                {fanSince && <span className="polaroid-since">since {fanSince.slice(0, 4)}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
