import { useMemo, useState } from 'react'
import { AnimeGrid } from '../components/AnimeGrid'
import { AnimeTable } from '../components/AnimeTable'
import { PageTitle } from '../components/PageTitle'
import { Segmented } from '../components/Segmented'
import animeData from '../data/anime.json'
import { sortAnime, type SortKey, type SortOrder } from '../lib/anime'
import type { Anime } from '../types'

type ViewMode = 'card' | 'list'

const allAnime: Anime[] = animeData

const viewOptions: { value: ViewMode; label: string }[] = [
  { value: 'card', label: 'Card' },
  { value: 'list', label: 'List' },
]

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'score', label: 'Total Score' },
  { value: 'progress', label: 'Progress' },
  { value: 'episodes', label: 'Total Episodes' },
  { value: 'firstYear', label: 'First Season Year' },
  { value: 'lastYear', label: 'Last Season Year' },
]

const orderOptions: { value: SortOrder; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
]

export function AnimePage() {
  const [view, setView] = useState<ViewMode>('card')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [order, setOrder] = useState<SortOrder>('desc')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const list = useMemo(() => sortAnime(allAnime, sortKey, order), [sortKey, order])
  const sortName = sortOptions.find((option) => option.value === sortKey)!.label

  const toggle = (id: number) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  return (
    <div className="paper-page">
      <PageTitle title="My Anime List" emoji="🌸" tone="--pink-soft" tape="orange" />

      <section className="toolbar" aria-label="Display options">
        <Segmented label="View" options={viewOptions} value={view} onChange={setView} />
        <Segmented label="Sort" options={sortOptions} value={sortKey} onChange={setSortKey} />
        <Segmented label="Order" options={orderOptions} value={order} onChange={setOrder} />
        <div className="control-options">
          <button
            type="button"
            className="pill"
            onClick={() => setExpanded(new Set(allAnime.map((anime) => anime.id)))}
          >
            Expand All
          </button>
          <button type="button" className="pill" onClick={() => setExpanded(new Set())}>
            Collapse All
          </button>
        </div>
      </section>

      <section className="anime-body">
        {view === 'card' ? (
          <AnimeGrid list={list} sortKey={sortKey} expanded={expanded} onToggle={toggle} />
        ) : (
          <AnimeTable
            list={list}
            sortKey={sortKey}
            sortName={sortName}
            expanded={expanded}
            onToggle={toggle}
          />
        )}
      </section>
    </div>
  )
}
