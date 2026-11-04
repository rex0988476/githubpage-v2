export const profile = [
  { label: 'Gender', value: 'M' },
  { label: 'Age', value: '23' },
  { label: 'Country', value: 'Taiwan' },
  { label: 'Status', value: 'Suffering in CSIE graduate school now 🫠' },
]

export interface Hobby {
  name: string
  icon: string
  /** 站內路由 */
  to?: string
  /** 外部連結 */
  href?: string
}

export const hobbies: Hobby[] = [
  { name: 'Game', icon: 'game.png', to: '/games' },
  { name: 'Anime', icon: 'anime.png', to: '/anime' },
  { name: 'Music', icon: 'listen.png', to: '/music' },
  { name: 'Sing', icon: 'singing.png' },
  { name: 'Dance', icon: 'dancing.png' },
  { name: 'Instrument', icon: 'piano.png' },
  { name: 'Programming', icon: 'programming.png', href: 'https://github.com/rex0988476' },
  { name: 'Novel', icon: 'detective-story.png' },
]
