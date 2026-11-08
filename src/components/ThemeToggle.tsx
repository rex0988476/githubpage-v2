import type { Theme } from './useTheme'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? '切換到白天' : '切換到夜晚'}
      onClick={onToggle}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        {dark ? (
          <path className="theme-moon" d="M20 5c-6 1-10 6-9.5 12 .5 6 6 10 12 9.5 2.5-.3 4.5-1.3 6-3-7 1-12.5-4.5-11.5-11.5.5-2.8 1.5-5 3-7Z" />
        ) : (
          <g className="theme-sun">
            <circle cx="16" cy="16" r="6" />
            <path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8" />
          </g>
        )}
      </svg>
    </button>
  )
}
