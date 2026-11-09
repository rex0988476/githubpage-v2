import {
  siDiscord,
  siGithub,
  siInstagram,
  siOsu,
  siSpotify,
  siX,
  siYoutube,
  type SimpleIcon,
} from 'simple-icons'

export const profile = [
  { label: 'Gender', value: 'M' },
  { label: 'Age', value: '24' },
  { label: 'Country', value: 'Taiwan' },
  { label: 'Status', value: 'looking for a job' },
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

export interface SocialLink {
  name: string
  url: string
  /** 帳號，滑鼠移上去的提示文字會帶上 */
  handle?: string
  /** Simple Icons 的圖示，顏色用它的品牌色 */
  icon: SimpleIcon
}

/** 首頁開頭的小圖示 */
export const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://x.com/_rex09_', handle: '@_rex09_', icon: siX },
  { name: 'Instagram', url: 'https://www.instagram.com/rex09_/', handle: '@rex09_', icon: siInstagram },
  { name: 'YouTube', url: 'https://www.youtube.com/@rex09_17', handle: '@rex09_17', icon: siYoutube },
  { name: 'Discord', url: 'https://discord.com/users/647016252597993474', icon: siDiscord },
  { name: 'osu!', url: 'https://osu.ppy.sh/users/11426995', icon: siOsu },
  { name: 'Spotify', url: 'https://open.spotify.com/user/31cfp2pko5xugvk5fizk5yvtcfaq', icon: siSpotify },
  { name: 'GitHub', url: 'https://github.com/rex0988476', handle: 'rex0988476', icon: siGithub },
]
