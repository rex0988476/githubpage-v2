import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/PageTitle'
import { artists } from '../data/music/artists'

/** 每張拍立得歪的角度，用 slug 算出來，重新整理也不會變 */
function tilt(slug: string) {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return `${((hash % 7) - 3) * 0.8}deg`
}

export function MusicPage() {
  return (
    <div className="paper-page">
      <PageTitle title="My Music" emoji="🎧" tone="--lavender-soft" tape="pink" />
      <section className="music-body" aria-label="Artists">
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
