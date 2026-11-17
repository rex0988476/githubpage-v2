import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  // 音樂家頁的 Collection 是疊在頁面上的，開關時頁面要留在原位；
  // 逐集心得頁換集數時由頁面自己捲到那一集
  const page = pathname.match(/^\/(?:music\/artists\/[^/]+|anime\/\d+)/)?.[0] ?? pathname

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return null
}
