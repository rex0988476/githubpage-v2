import { createElement, lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { artists } from '../data/music/artists'
import type { Artist } from '../types'

// 專屬頁分開打包，只有打開該音樂家時才下載
const pages: Record<string, LazyExoticComponent<ComponentType<{ artist: Artist }>>> = {
  'hoshimachi-suisei': lazy(() => import('./artists/hoshimachi-suisei/SuiseiPage')),
  himehina: lazy(() => import('./artists/himehina/HimehinaPage')),
  others: lazy(() => import('./artists/others/OthersPage')),
}

export function ArtistPage() {
  const { slug } = useParams()
  const artist = artists.find((item) => item.slug === slug)
  const Page = artist && pages[artist.slug]

  if (!artist || !Page) return <Navigate to="/music" replace />

  return <Suspense fallback={null}>{createElement(Page, { artist })}</Suspense>
}
