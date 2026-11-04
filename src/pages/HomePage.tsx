import { Link } from 'react-router-dom'
import { hobbies, profile, type Hobby } from '../data/profile'

const iconUrl = (icon: string) => `${import.meta.env.BASE_URL}images/${icon}`

function HobbyItem({ hobby }: { hobby: Hobby }) {
  const content = (
    <>
      <img src={iconUrl(hobby.icon)} alt="" />
      <span>{hobby.name}</span>
    </>
  )
  if (hobby.to) return <Link to={hobby.to}>{content}</Link>
  if (hobby.href) return <a href={hobby.href}>{content}</a>
  return content
}

export function HomePage() {
  return (
    <>
      <section className="hero hero-home">
        <h1>Halo👋, I'm rex0988476</h1>
        <p>Welcome to my webpage :3</p>
      </section>

      <section className="profile">
        <img src={iconUrl('pfp.jpg')} alt="rex0988476's profile picture" />
        <dl>
          {profile.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="hobbies" aria-label="Hobbies">
        <ul>
          {hobbies.map((hobby) => (
            <li key={hobby.name}>
              <HobbyItem hobby={hobby} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
