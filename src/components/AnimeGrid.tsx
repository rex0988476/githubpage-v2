import type { CSSProperties } from 'react'
import { cardTilt, coverChip, coverUrl, type SortKey } from '../lib/anime'
import type { Anime } from '../types'
import { AnimeDetails } from './AnimeDetails'
import { ScoreSticker } from './ScoreSticker'

interface AnimeGridProps {
  list: Anime[]
  sortKey: SortKey
  expanded: Set<number>
  onToggle: (id: number) => void
}

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
        const chip = coverChip(anime, sortKey)
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
                {chip && (
                  <span className="cover-chip" data-kind={chip.kind}>
                    {chip.text}
                  </span>
                )}
              </span>
              <ScoreSticker score={anime.score} variant="on-cover" />
              <span className="cover-title">{anime.title}</span>
            </button>
            {isOpen && <AnimeDetails anime={anime} />}
          </li>
        )
      })}
    </ul>
  )
}
