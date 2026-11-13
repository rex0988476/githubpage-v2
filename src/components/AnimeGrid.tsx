import type { CSSProperties } from 'react'
import { cardTilt, coverUrl, progressTag, scoreTier, sortLabel, type SortKey } from '../lib/anime'
import type { Anime } from '../types'
import { AnimeDetails } from './AnimeDetails'

interface AnimeGridProps {
  list: Anime[]
  sortKey: SortKey
  expanded: Set<number>
  onToggle: (id: number) => void
}

// 分數和進度已經畫在封面上，其他排序才在標題下方補一行排序值
const metaKeys: SortKey[] = ['episodes', 'firstYear', 'lastYear']

export function AnimeGrid({ list, sortKey, expanded, onToggle }: AnimeGridProps) {
  const handleToggle = (id: number, card: HTMLElement) => {
    const opening = !expanded.has(id)
    onToggle(id)
    if (opening) {
      requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
    }
  }

  return (
    <ul className="anime-grid">
      {list.map((anime) => {
        const isOpen = expanded.has(anime.id)
        const tag = progressTag(anime)
        return (
          <li key={anime.id} className={isOpen ? 'anime-card open' : 'anime-card'}>
            <button
              type="button"
              className="cover-button"
              aria-expanded={isOpen}
              style={{ '--tilt': `${cardTilt(anime)}deg` } as CSSProperties}
              onClick={(event) =>
                handleToggle(anime.id, event.currentTarget.parentElement as HTMLElement)
              }
            >
              <span className="cover">
                <img src={coverUrl(anime)} alt="" loading="lazy" />
                {tag && <span className="progress-tag">{tag}</span>}
              </span>
              <span
                className="score-sticker"
                data-tier={scoreTier(anime.score)}
                aria-label={anime.score === null ? 'Not rated' : `Score ${anime.score}`}
              >
                {anime.score === 10 && (
                  <span className="score-star" aria-hidden="true">
                    ★
                  </span>
                )}
                {anime.score ?? '-'}
              </span>
              <span className="cover-title">{anime.title}</span>
              {metaKeys.includes(sortKey) && (
                <span className="cover-meta">{sortLabel(anime, sortKey)}</span>
              )}
            </button>
            {isOpen && <AnimeDetails anime={anime} />}
          </li>
        )
      })}
    </ul>
  )
}
