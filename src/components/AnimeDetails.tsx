import { seasonProgress } from '../lib/anime'
import type { Anime } from '../types'

export function AnimeDetails({ anime }: { anime: Anime }) {
  return (
    <div className="details">
      <div className="details-head">
        <h3>{anime.title}</h3>
        <p className="details-score">
          {anime.score === null ? '-' : anime.score}
          <small> / 10</small>
        </p>
      </div>

      <div className="table-scroll">
        <table className="season-table">
          <thead>
            <tr>
              <td />
              {anime.seasons.map((_, i) => (
                <th key={i} scope="col">
                  S{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Year</th>
              {anime.seasons.map((season, i) => (
                <td key={i}>{season.year}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Progress</th>
              {anime.seasons.map((season, i) => (
                <td key={i}>{seasonProgress(season)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Score</th>
              {anime.seasons.map((season, i) => (
                <td key={i}>{season.score ?? '-'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {anime.tags.length > 0 && (
        <ul className="tags">
          {anime.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      {anime.review && <p className="review">{anime.review}</p>}
    </div>
  )
}
