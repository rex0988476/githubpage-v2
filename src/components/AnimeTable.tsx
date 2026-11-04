import { Fragment } from 'react'
import { coverUrl, currentSeason, seasonProgress, sortLabel, type SortKey } from '../lib/anime'
import type { Anime } from '../types'
import { AnimeDetails } from './AnimeDetails'

interface AnimeTableProps {
  list: Anime[]
  sortKey: SortKey
  sortName: string
  expanded: Set<number>
  onToggle: (id: number) => void
}

function progressText(anime: Anime) {
  const current = currentSeason(anime)
  if (!current) return 'completed'
  return `S${current.index + 1} · ${seasonProgress(current.season)}`
}

export function AnimeTable({ list, sortKey, sortName, expanded, onToggle }: AnimeTableProps) {
  // 依評分或進度排序時，表格本來就有對應的欄位，不需要多一欄
  const showSortColumn = sortKey !== 'score' && sortKey !== 'progress'
  const columnCount = showSortColumn ? 4 : 3

  return (
    <div className="table-scroll">
      <table className="anime-table">
        <thead>
          <tr>
            {showSortColumn && <th scope="col">{sortName}</th>}
            <th scope="col">Title</th>
            <th scope="col">Score</th>
            <th scope="col">Progress</th>
          </tr>
        </thead>
        <tbody>
          {list.map((anime) => {
            const isOpen = expanded.has(anime.id)
            return (
              <Fragment key={anime.id}>
                <tr className={isOpen ? 'open' : undefined}>
                  {showSortColumn && <td className="nowrap">{sortLabel(anime, sortKey)}</td>}
                  <td>
                    <button
                      type="button"
                      className="row-button"
                      aria-expanded={isOpen}
                      onClick={() => onToggle(anime.id)}
                    >
                      {anime.title}
                    </button>
                  </td>
                  <td>{anime.score ?? '-'}</td>
                  <td className="nowrap">{progressText(anime)}</td>
                </tr>
                {isOpen && (
                  <tr className="details-row">
                    <td colSpan={columnCount}>
                      <div className="details-with-cover">
                        <img src={coverUrl(anime)} alt="" loading="lazy" />
                        <AnimeDetails anime={anime} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
