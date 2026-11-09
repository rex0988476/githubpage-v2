import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/PageTitle'
import { artists } from '../data/music/artists'

export function MusicPage() {
  return (
    <div className="paper-page">
      <PageTitle title="My Music" emoji="🎧" tone="--lavender-soft" tape="pink" />
      <section className="music-body" aria-label="Artists">
        <ul className="artist-wall">
          {artists.map(({ slug, name, accent }) => (
            <li key={slug}>
              <Link
                to={`/music/artists/${slug}`}
                lang="ja"
                style={{ '--artist-accent': accent } as CSSProperties}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
