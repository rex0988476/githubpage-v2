import '@fontsource-variable/nunito/wght.css'
import { Link } from 'react-router-dom'
import { DoodleAvatar } from '../components/DoodleAvatar'
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
  return <div>{content}</div>
}

export function HomePage() {
  return (
    <div className="home">
      <section className="home-intro">
        <div className="home-avatar">
          <span className="tape" aria-hidden="true" />
          <DoodleAvatar label="rex0988476's profile picture" />
        </div>
        <div className="home-intro-text">
          <h1>
            Halo👋, I'm <span className="marker">rex0988476</span>
          </h1>
          <p>Welcome to my webpage :3</p>
          <dl className="home-tags">
            {profile.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="home-hobbies" aria-labelledby="hobbies-title">
        <h2 id="hobbies-title">
          <span className="marker">Hobbies</span>
        </h2>
        <ul>
          {hobbies.map((hobby) => (
            <li key={hobby.name}>
              <HobbyItem hobby={hobby} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
