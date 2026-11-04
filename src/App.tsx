import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { AnimePage } from './pages/AnimePage'
import { ArtistPage } from './pages/ArtistPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { MusicPage } from './pages/MusicPage'

// 用 HashRouter：GitHub Pages 沒有伺服器端路由，重新整理子頁面才不會 404
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="anime" element={<AnimePage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="music" element={<MusicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        {/* 音樂家頁不套共用外框，各頁有自己的完整設計 */}
        <Route path="music/artists/:slug" element={<ArtistPage />} />
      </Routes>
    </HashRouter>
  )
}
