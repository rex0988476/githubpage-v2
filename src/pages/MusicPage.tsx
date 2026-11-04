import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { artists } from '../data/music/artists'

export function MusicPage() {
  return (
    <>
      <section className="hero">
        <h1>My Music 🎧</h1>
      </section>
      <section className="page-body">
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
    </>
  )
}
