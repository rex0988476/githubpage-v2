import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/anime', label: 'Anime' },
  { to: '/games', label: 'Games' },
]

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <header className="site-header">
        <nav aria-label="Main">
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
