import type { CSSProperties } from 'react'
import { seasonLabel, seasonState } from '../lib/anime'
import type { Anime } from '../types'
import { ScoreSticker } from './ScoreSticker'

export function AnimeDetails({ anime }: { anime: Anime }) {
  return (
    <div className="details">
      <div className="details-head">
        <h3>{anime.title}</h3>
        <ScoreSticker score={anime.score} variant="large" />
      </div>

      <ol className="season-list">
        {anime.seasons.map((season, i) => {
          const { state, percent, text } = seasonState(season)
          return (
            <li key={i} className="season" data-state={state}>
              <span className="season-name">{seasonLabel(season, i)}</span>
              <span className="season-year">{season.year}</span>
              <span
                className="season-bar"
                role="img"
                aria-label={text}
                style={{ '--percent': `${percent}%` } as CSSProperties}
              />
              <span className="season-count">
                {text}
                {season.extras ? (
                  <span className="season-extras">
                    {Object.entries(season.extras).map(([kind, count]) => (
                      <span key={kind}>
                        +{count} {kind}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
              <ScoreSticker score={season.score} variant="mini" />
            </li>
          )
        })}
      </ol>

      {anime.tags.length > 0 && (
        <ul className="tags">
          {anime.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      {anime.review && <p className="review-note">{anime.review}</p>}
    </div>
  )
}
