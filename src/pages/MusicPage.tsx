import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageTitle } from '../components/PageTitle'
import { artists } from '../data/music/artists'
import { performerColors } from '../data/music/performers'
import { concertTimeline, currentYear, inkOn } from '../lib/music'
import type { ArtistEvent } from '../types'

/** 每張拍立得歪的角度，用 slug 算出來，重新整理也不會變 */
function tilt(slug: string) {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return `${((hash % 7) - 3) * 0.8}deg`
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

/** 沒有專屬頁、也還沒在 performerColors 指定顏色的演出者，依名字固定挑一個 */
const guestAccents = ['#f28bb0', '#2f8fe6', '#8f7ae6', '#3fb58b', '#f0a23a', '#e86a5a', '#3bb3c9']

function guestAccent(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return guestAccents[hash % guestAccents.length]
}

/** 演出者的代表色：有專屬頁的用 accent，其次是 performerColors，都沒有就從色盤挑 */
function colorOf(name: string) {
  return (
    artists.find((artist) => artist.slug === name)?.accent ??
    performerColors[name] ??
    guestAccent(name)
  )
}

/**
 * 演唱會票根：左邊是日期存根，右邊是場次。
 * 只連到一個專屬頁時整張可以點（例如只有一位演出者，或歸在 Others）；
 * 多位有專屬頁的演出者時改成點名字。
 */
function ConcertTicket({ event, upcoming }: { event: ArtistEvent; upcoming: boolean }) {
  const all = event.performers.map((name) => ({
    name,
    artist: artists.find((artist) => artist.slug === name),
  }))
  // Others 這類分類頁不當成演出者顯示
  const performers = all.filter(({ artist }) => !artist?.category)
  const linked = all.flatMap(({ artist }) => (artist ? [artist] : []))
  const firstArtist = linked.length === 1 ? linked[0] : undefined
  const realArtist = performers.find(({ artist }) => artist)?.artist
  const firstName = performers[0]?.name ?? event.title
  const accent =
    event.color ?? realArtist?.accent ?? performerColors[firstName] ?? guestAccent(firstName)
  const wholeLink =
    firstArtist !== undefined && (performers.length === 1 || firstArtist.category === true)
  const [year, month, day] = event.date.split('-')
  const linkState = { focusEvent: event.id }

  const content = (
    <>
      <time className="ticket-stub" dateTime={event.date}>
        <span className="ticket-day">
          {month}.{day}
        </span>
        <span className="ticket-year">{year}</span>
      </time>
      <span className="ticket-body">
        {event.type === 'fanmeeting' && <span className="ticket-kind">Fan Meeting</span>}
        {upcoming && <span className="ticket-upcoming">即將參戰</span>}
        <span className="ticket-title">{event.title}</span>
        {event.subtitle && <span className="ticket-place">{event.subtitle}</span>}
        <span className="ticket-artists" lang="ja">
          {performers.map(({ name, artist }) => {
            const color = colorOf(name)
            const style = { '--chip-bg': color, '--chip-ink': inkOn(color) } as CSSProperties
            return artist && !wholeLink ? (
              <Link
                key={name}
                to={`/music/artists/${artist.slug}`}
                state={linkState}
                className="ticket-artist"
                style={style}
              >
                {artist.name}
              </Link>
            ) : (
              <span key={name} className="ticket-artist" style={style}>
                {artist?.name ?? name}
              </span>
            )
          })}
        </span>
      </span>
    </>
  )

  return (
    <li style={{ '--artist-accent': accent, '--stub-ink': inkOn(accent) } as CSSProperties}>
      {wholeLink ? (
        <Link to={`/music/artists/${firstArtist.slug}`} state={linkState} className="ticket">
          {content}
        </Link>
      ) : (
        <div className="ticket">{content}</div>
      )}
    </li>
  )
}

export function MusicPage() {
  const { upcoming, past } = concertTimeline()
  const concerts = [...upcoming, ...past]
  const fanMeetings = past.filter((event) => event.type === 'fanmeeting').length
  const years = [...new Set(concerts.map((event) => event.date.slice(0, 4)))]
  // 選的年份放在網址上，從音樂家頁按上一頁回來時還在
  const [params, setParams] = useSearchParams()
  const thisYear = currentYear()
  const fallbackYear = years.includes(thisYear) ? thisYear : (years[0] ?? 'all')
  const requested = params.get('year')
  const year = requested === 'all' || years.includes(requested ?? '') ? requested! : fallbackYear
  const shown = year === 'all' ? concerts : concerts.filter((event) => event.date.startsWith(year))
  const yearOptions = [
    { value: 'all', label: 'All', count: concerts.length },
    ...years.map((value) => ({
      value,
      label: value,
      count: concerts.filter((event) => event.date.startsWith(value)).length,
    })),
  ]

  return (
    <div className="paper-page">
      <PageTitle title="My Music" emoji="🎧" tone="--lavender-soft" tape="pink" />
      {upcoming.length + past.length > 0 && (
        <section className="music-body music-section" aria-labelledby="music-concerts">
          <h2 id="music-concerts">
            <span className="marker">Concerts</span>
            <small>
              {[
                plural(past.filter((event) => event.type === 'concert').length, 'concert'),
                fanMeetings > 0 && plural(fanMeetings, 'fan meeting'),
              ]
                .filter(Boolean)
                .join(' · ')}
            </small>
          </h2>
          <div className="concert-years" role="group" aria-label="Year">
            {yearOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="chip"
                aria-pressed={option.value === year}
                onClick={() => setParams({ year: option.value }, { replace: true })}
              >
                {option.label}
                <span className="chip-count">{option.count}</span>
              </button>
            ))}
          </div>
          <ul className="ticket-list">
            {shown.map((event) => (
              <ConcertTicket key={event.id} event={event} upcoming={upcoming.includes(event)} />
            ))}
          </ul>
        </section>
      )}
      <section className="music-body music-section" aria-labelledby="music-artists">
        <h2 id="music-artists">
          <span className="marker">Artists</span>
          <small>{artists.filter((artist) => !artist.category).length}</small>
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
