import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { PageTitle } from '../components/PageTitle'
import { games } from '../data/games'
import type { Game, GamePlatform, GameStatus } from '../types'

const shelves: { title: string; statuses: GameStatus[]; dock?: boolean }[] = [
  { title: 'Active', statuses: ['active'], dock: true },
  { title: 'Game library', statuses: ['semi-active', 'no'] },
]

/** Game library 再依平台分組；沒有遊戲的組不顯示。options 是組內的篩選按鈕 */
const libraryGroups: { title: string; filter: (game: Game) => boolean; options: GamePlatform[] }[] = [
  { title: 'Mobile & PC', filter: (game) => !game.cover, options: ['mobile', 'pc'] },
  { title: 'Console', filter: (game) => Boolean(game.cover), options: ['wii'] },
]

const platformLabels: Record<GamePlatform, string> = {
  mobile: 'Mobile',
  pc: 'PC',
  wii: 'Wii',
}

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

const linkImage = (image: string) => `${import.meta.env.BASE_URL}links/${image}`

function GameIcon({ game, onOpen }: { game: Game; onOpen: (game: Game) => void }) {
  const content = (
    <>
      <span className={game.cover ? 'game-icon game-cover' : 'game-icon'}>
        {game.cover ? (
          <img src={`${import.meta.env.BASE_URL}games/${game.cover}`} alt="" loading="lazy" />
        ) : game.icon ? (
          <img src={`${import.meta.env.BASE_URL}games/${game.icon}`} alt="" width={200} height={200} loading="lazy" />
        ) : (
          <span className="game-initials" style={{ '--app': game.color ?? fallbackColor(game.name) } as CSSProperties}>
            {initials(game.name)}
          </span>
        )}
        {game.links && (
          <span className="game-badge" aria-hidden="true">
            {game.links.length}
          </span>
        )}
      </span>
      <span className="game-name">{game.name}</span>
    </>
  )

  return (
    <li className="game-app">
      {game.links ? (
        <button type="button" className="game-app-button" aria-haspopup="dialog" onClick={() => onOpen(game)}>
          {content}
        </button>
      ) : (
        content
      )}
    </li>
  )
}

/** 點有連結的遊戲時跳出的小視窗 */
function GameLinksDialog({ game, onClose }: { game: Game | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (game && dialog && !dialog.open) dialog.showModal()
  }, [game])

  return (
    <dialog
      ref={dialogRef}
      className="game-dialog"
      aria-label={game ? `${game.name} links` : undefined}
      onClose={onClose}
      onClick={(event) => {
        // 點到視窗外的背景就關閉
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      {game?.links && (
        <div className="game-dialog-body">
          <button type="button" className="game-dialog-close" aria-label="關閉" onClick={() => dialogRef.current?.close()}>
            ✕
          </button>
          <h2>{game.name}</h2>
          <ul>
            {game.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  <img src={linkImage(link.image)} alt="" width={144} height={144} />
                  <span>{link.name}</span>
                  <span className="game-dialog-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}

/** 組標題加上篩選按鈕；null 代表全部 */
function GameGroup({
  title,
  games: groupGames,
  options,
  renderIcons,
}: {
  title: string
  games: Game[]
  options: GamePlatform[]
  renderIcons: (items: Game[]) => ReactNode
}) {
  const [platform, setPlatform] = useState<GamePlatform | null>(null)
  const items = platform ? groupGames.filter((game) => game.platforms?.includes(platform)) : groupGames
  const choices: { value: GamePlatform | null; label: string }[] = [
    { value: null, label: 'All' },
    ...options.map((value) => ({ value, label: platformLabels[value] })),
  ]

  return (
    <div className="game-group">
      <div className="game-group-head">
        <h3>
          {title}
          <small>{items.length}</small>
        </h3>
        <div className="game-filter" role="group" aria-label={`${title} platform`}>
          {choices.map(({ value, label }) => (
            <button key={label} type="button" aria-pressed={platform === value} onClick={() => setPlatform(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <ul className="game-grid">{renderIcons(items)}</ul>
    </div>
  )
}

export function GamesPage() {
  const [openGame, setOpenGame] = useState<Game | null>(null)

  return (
    <div className="paper-page">
      <PageTitle title="My Gaming List" emoji="🎮" tone="--sky-soft" tape="green" />
      {shelves.map(({ title, statuses, dock }, i) => {
        const list = games.filter((game) => statuses.includes(game.status))
        if (list.length === 0) return null
        const icons = (items: Game[]) =>
          items.map((game) => <GameIcon key={game.name} game={game} onOpen={setOpenGame} />)
        return (
          <section key={title} className="game-shelf" aria-labelledby={`games-shelf-${i}`}>
            <h2 id={`games-shelf-${i}`}>
              <span className="marker">{title}</span>
              <small>{list.length}</small>
            </h2>
            {dock ? (
              <ul className="game-dock">{icons(list)}</ul>
            ) : (
              libraryGroups.map((group) => {
                const items = list.filter(group.filter)
                if (items.length === 0) return null
                return (
                  <GameGroup
                    key={group.title}
                    title={group.title}
                    games={items}
                    options={group.options}
                    renderIcons={icons}
                  />
                )
              })
            )}
          </section>
        )
      })}
      <GameLinksDialog game={openGame} onClose={() => setOpenGame(null)} />
    </div>
  )
}
