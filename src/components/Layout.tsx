import '@fontsource-variable/nunito/wght.css'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { DoodleMark } from './DoodleAvatar'

const links = [
  { to: '/', label: 'Home' },
  { to: '/anime', label: 'Anime' },
  { to: '/games', label: 'Games' },
  { to: '/music', label: 'Music' },
]

/** 螢光筆的位置跟著目前頁面的連結走 */
function useMarker() {
  const navRef = useRef<HTMLElement>(null)
  const [marker, setMarker] = useState<CSSProperties | null>(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const update = () => {
      const active = nav.querySelector<HTMLElement>('a.active')
      // 往內縮一點，只蓋住字
      const inset = 5
      setMarker(active ? { left: active.offsetLeft + inset, width: active.offsetWidth - inset * 2 } : null)
    }
    update()
    // 圓體載入後字寬會變
    void document.fonts.ready.then(update)
    const observer = new ResizeObserver(update)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [pathname])

  return { navRef, marker }
}

export function Layout() {
  const { navRef, marker } = useMarker()

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-brand">
          <DoodleMark />
          <span>rex0988476</span>
        </Link>
        <nav ref={navRef} aria-label="Main">
          <span className="nav-marker" aria-hidden="true" style={marker ?? { opacity: 0 }} />
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">© 2025 rex0988476</footer>
    </>
  )
}
