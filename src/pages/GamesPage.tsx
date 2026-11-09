import type { CSSProperties } from 'react'
import { PageTitle } from '../components/PageTitle'
import { games } from '../data/games'
import type { Game, GameStatus } from '../types'

const shelves: { title: string; statuses: GameStatus[]; dock?: boolean }[] = [
  { title: 'Active', statuses: ['active'], dock: true },
  { title: 'Game library', statuses: ['semi-active', 'no'] },
]

/** 沒有 icon 時縮寫方塊的底色，依名稱固定挑一個，不靠順序 */
const fallbackColors = ['#e05a6d', '#4a7bca', '#7c6fd6', '#2fa58a', '#e89a3c', '#d46aa8', '#3f8fb5', '#8a6e5a']

function fallbackColor(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return fallbackColors[hash % fallbackColors.length]
}

/** 名稱縮寫：取每個字的第一個字母，例如 Summoners War → SW */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

function GameIcon({ game }: { game: Game }) {
  return (
    <li className="game-app">
      <span className="game-icon">
        {game.icon ? (
          <img src={`${import.meta.env.BASE_URL}games/${game.icon}`} alt="" width={200} height={200} loading="lazy" />
        ) : (
          <span className="game-initials" style={{ '--app': game.color ?? fallbackColor(game.name) } as CSSProperties}>
            {initials(game.name)}
          </span>
        )}
      </span>
      <span className="game-name">{game.name}</span>
    </li>
  )
}

export function GamesPage() {
  return (
    <div className="paper-page">
      <PageTitle title="My Gaming List" emoji="🎮" tone="--sky-soft" tape="green" />
      {shelves.map(({ title, statuses, dock }, i) => {
        const list = games.filter((game) => statuses.includes(game.status))
        if (list.length === 0) return null
        return (
          <section key={title} className="game-shelf" aria-labelledby={`games-shelf-${i}`}>
            <h2 id={`games-shelf-${i}`}>
              <span className="marker">{title}</span>
              <small>{list.length}</small>
            </h2>
            <ul className={dock ? 'game-dock' : 'game-grid'}>
              {list.map((game) => (
                <GameIcon key={game.name} game={game} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
