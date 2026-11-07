import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  // 音樂家頁的 Collection 是疊在頁面上的，開關時頁面要留在原位
  const page = pathname.match(/^\/music\/artists\/[^/]+/)?.[0] ?? pathname

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return null
}
