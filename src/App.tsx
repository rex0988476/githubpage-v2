import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AnimePage } from './pages/AnimePage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'

// 用 HashRouter：GitHub Pages 沒有伺服器端路由，重新整理子頁面才不會 404
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="anime" element={<AnimePage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
