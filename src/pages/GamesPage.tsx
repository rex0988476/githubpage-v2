import { games } from '../data/games'

export function GamesPage() {
  return (
    <>
      <section className="hero">
        <h1>My Gaming List 🎮</h1>
      </section>
      <section className="page-body">
        <ul className="game-list">
          {games.map(({ name, status }) => (
            <li key={name}>
              <span>{name}</span>
              <span className={`status status-${status}`}>{status}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
