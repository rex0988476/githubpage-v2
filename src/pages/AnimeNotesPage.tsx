import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SeasonName } from '../components/SeasonName'
import { Spoiler } from '../components/Spoiler'
import animeData from '../data/anime.json'
import { coverUrl } from '../lib/anime'
import { hasNotes, loadNotes, type EpisodeNote, type NotePhoto } from '../lib/animeNotes'
import { animeView } from '../lib/animeView'
import { Lightbox } from './artists/shared/Lightbox'
import type { Anime } from '../types'

const allAnime: Anime[] = animeData

/** 某一季寫了超過這個數量，目錄就改成先選季 */
const TABS_THRESHOLD = 20

const lightboxClasses = {
  lightbox: 'notes-lightbox',
  lightboxBody: 'notes-lightbox-body',
  lightboxNav: 'notes-lightbox-nav',
  lightboxPrev: 'notes-lightbox-prev',
  lightboxNext: 'notes-lightbox-next',
  lightboxCount: 'notes-lightbox-count',
  lightboxClose: 'notes-lightbox-close',
}

const scrollToEpisode = (key: string) =>
  document.querySelector(`[data-ep="${key}"]`)?.scrollIntoView({ block: 'start' })

/** 逐集心得頁：#/anime/<id>，#/anime/<id>/s1e3 直接跳到那一集 */
export default function AnimeNotesPage() {
  const { id: idParam, ep } = useParams()
  const id = Number(idParam)
  const anime = allAnime.find((item) => item.id === id)
  const [notes, setNotes] = useState<EpisodeNote[] | null>(null)
  const [pickedSeason, setPickedSeason] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<{ photos: NotePhoto[]; index: number } | null>(null)

  // 回 Anime 頁時展開這部並捲過去；直接打開心得頁的網址也一樣
  useEffect(() => {
    animeView.focus = id
  }, [id])

  useEffect(() => {
    let alive = true
    loadNotes(id).then((loaded) => {
      if (alive) setNotes(loaded)
    })
    return () => {
      alive = false
    }
  }, [id])

  // 網址指定集數時捲過去；第一次載入要等心得讀完
  useEffect(() => {
    if (notes && ep) scrollToEpisode(ep)
  }, [notes, ep])

  if (!anime || !hasNotes(id)) return <Navigate to="/anime" replace />

  const overviews = (notes ?? []).filter((note) => note.overview)
  const episodes = (notes ?? []).filter((note) => !note.overview)
  const seasons = [...new Set(episodes.map((note) => note.season))]
  const multiSeason = anime.seasons.length > 1 || seasons.some((season) => season !== 1)
  const useTabs = seasons.some(
    (season) => episodes.filter((note) => note.season === season).length > TABS_THRESHOLD,
  )
  const targetSeason = episodes.find((note) => note.key === ep)?.season
  const activeSeason = pickedSeason ?? targetSeason ?? seasons[0]
  const tocSeasons = useTabs ? seasons.filter((season) => season === activeSeason) : seasons

  const seasonLabel = (season: number) => {
    const data = anime.seasons[season - 1]
    return data ? <SeasonName season={data} index={season - 1} /> : `S${season}`
  }
  const episodeLabel = (note: EpisodeNote) =>
    note.overview ? 'Overview' : `${note.kind ?? 'E'}${note.episode}`
  const tocLink = (note: EpisodeNote) => (
    <li key={note.key}>
      <Link
        to={`/anime/${id}/${note.key}`}
        replace
        aria-current={note.key === ep || undefined}
        data-special={note.kind ? true : undefined}
        // 已經在同一集的網址時不會觸發捲動，自己捲
        onClick={() => note.key === ep && scrollToEpisode(note.key)}
      >
        {episodeLabel(note)}
      </Link>
    </li>
  )

  return (
    <div className="paper-page anime-notes-page">
      <header className="notes-head">
        <Link className="notes-back" to="/anime">
          ← Anime
        </Link>
        <div className="notes-hero">
          <img src={coverUrl(anime)} alt="" />
          <div>
            <h1>{anime.title}</h1>
            {!notes ? (
              <p>Loading…</p>
            ) : (
              episodes.length > 0 && (
                <p>
                  {episodes.length} episode {episodes.length === 1 ? 'note' : 'notes'}
                </p>
              )
            )}
          </div>
        </div>
      </header>

      {/* 只有一篇時不需要目錄 */}
      {notes && notes.length > 1 && (
        <nav className="notes-toc" aria-label="Episodes">
          {overviews.length > 0 && (
            <div className="notes-toc-row">
              <ul>{overviews.map(tocLink)}</ul>
            </div>
          )}
          {useTabs && (
            <div className="notes-toc-tabs" role="group" aria-label="Season">
              {seasons.map((season) => (
                <button
                  key={season}
                  type="button"
                  aria-pressed={season === activeSeason}
                  onClick={() => setPickedSeason(season)}
                >
                  {seasonLabel(season)}
                </button>
              ))}
            </div>
          )}
          {tocSeasons.map((season) => (
            <div key={season} className="notes-toc-row">
              {multiSeason && !useTabs && (
                <span className="notes-toc-season">{seasonLabel(season)}</span>
              )}
              <ul>{episodes.filter((note) => note.season === season).map(tocLink)}</ul>
            </div>
          ))}
        </nav>
      )}

      {notes && (
        <ol className="notes-list">
          {notes.map((note) => (
            <li key={note.key} data-ep={note.key} data-current={note.key === ep || undefined}>
              <article className="episode-note">
                <header>
                  <h2>
                    {multiSeason && !note.overview && (
                      <span className="episode-season">{seasonLabel(note.season)}</span>
                    )}
                    {episodeLabel(note)}
                  </h2>
                  {note.title && <span className="episode-title">{note.title}</span>}
                  {note.date && <time dateTime={note.date}>{note.date}</time>}
                </header>
                <Spoiler label={episodeLabel(note)} className="episode-body">
                  {note.blocks.map((block, i) =>
                    block.kind === 'text' ? (
                      <p key={i}>{block.text}</p>
                    ) : (
                      <ul key={i} className="episode-photos">
                        {block.photos.map((photo, index) => (
                          <li key={photo.image}>
                            <figure>
                              <button
                                type="button"
                                aria-label={`Enlarge${photo.alt ? `: ${photo.alt}` : ''}`}
                                onClick={() => setLightbox({ photos: block.photos, index })}
                              >
                                <img src={photo.image} alt={photo.alt} loading="lazy" />
                              </button>
                              {photo.caption && <figcaption>{photo.caption}</figcaption>}
                            </figure>
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </Spoiler>
              </article>
            </li>
          ))}
        </ol>
      )}

      <Lightbox
        photos={lightbox?.photos ?? []}
        index={lightbox?.index ?? null}
        onIndexChange={(index) => setLightbox((current) => current && { ...current, index })}
        onClose={() => setLightbox(null)}
        classes={lightboxClasses}
        urlOf={(image) => image}
      />
    </div>
  )
}
