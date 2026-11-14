import { useMemo, useState } from 'react'
import { AnimeGrid } from '../components/AnimeGrid'
import { AnimeTable } from '../components/AnimeTable'
import { PageTitle } from '../components/PageTitle'
import animeData from '../data/anime.json'
import { animeStats, sortAnime, type SortKey, type SortOrder } from '../lib/anime'
import type { Anime } from '../types'

type ViewMode = 'card' | 'list'

const allAnime: Anime[] = animeData
const stats = animeStats(allAnime)

const viewOptions: { value: ViewMode; label: string }[] = [
  { value: 'card', label: 'Card' },
  { value: 'list', label: 'List' },
]

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'score', label: 'Score' },
  { value: 'progress', label: 'Progress' },
  { value: 'episodes', label: 'Episodes' },
  { value: 'firstYear', label: 'First Year' },
  { value: 'lastYear', label: 'Last Year' },
]

const orderNames: Record<SortOrder, string> = { asc: 'ascending', desc: 'descending' }

export function AnimePage() {
  const [view, setView] = useState<ViewMode>('card')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [order, setOrder] = useState<SortOrder>('desc')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const list = useMemo(() => sortAnime(allAnime, sortKey, order), [sortKey, order])
  const sortName = sortOptions.find((option) => option.value === sortKey)!.label
  const anyExpanded = expanded.size > 0

  // 點目前的排序就反轉方向，點別的排序只換依據、方向不變
  const chooseSort = (key: SortKey) => {
    if (key === sortKey) setOrder((previous) => (previous === 'asc' ? 'desc' : 'asc'))
    else setSortKey(key)
  }

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

      <dl className="anime-stats" aria-label="Stats">
        <div>
          <dt>Titles</dt>
          <dd>{stats.titles}</dd>
        </div>
        <div>
          <dt>Completed</dt>
          <dd>{stats.completed}</dd>
        </div>
        <div>
          <dt>Episodes</dt>
          <dd>{stats.episodes.toLocaleString('en-US')}</dd>
          {stats.extras > 0 && <dd className="anime-stats-extra">+{stats.extras} specials</dd>}
        </div>
      </dl>

      <section className="anime-toolbar" aria-label="Display options">
        <div className="anime-sort" role="group" aria-label="Sort">
          <span className="anime-toolbar-label" aria-hidden="true">
            Sort
          </span>
          {sortOptions.map((option) => {
            const active = option.value === sortKey
            return (
              <button
                key={option.value}
                type="button"
                className="chip"
                aria-pressed={active}
                aria-label={active ? `${option.label}, ${orderNames[order]}` : undefined}
                title={active ? 'Click again to reverse' : undefined}
                onClick={() => chooseSort(option.value)}
              >
                {option.label}
                {active && (
                  <span className="sort-arrow" aria-hidden="true">
                    {order === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="anime-toolbar-end">
          <button
            type="button"
            className="chip"
            onClick={() =>
              setExpanded(anyExpanded ? new Set() : new Set(allAnime.map((anime) => anime.id)))
            }
          >
            {anyExpanded ? 'Collapse all' : 'Expand all'}
          </button>
          <div className="view-switch" role="group" aria-label="View">
            {viewOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={option.value === view}
                onClick={() => setView(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
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
