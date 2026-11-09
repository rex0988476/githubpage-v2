import type { Game } from '../types'

export const games: Game[] = [
  { name: 'BrownDust2', status: 'active', icon: 'bd2.webp' },
  { name: 'hololive Dreams', status: 'active', icon: 'hd.webp' },
  { name: 'BanG Dream! Our Notes', status: 'active', icon: 'bdon.webp' },
  { name: 'Summoners War', status: 'semi-active', icon: 'sw.webp' },
  {
    name: 'osu!',
    status: 'semi-active',
    icon: 'osu.webp',
    links: [
      {
        name: "Rex09's taiko",
        url: 'https://drive.google.com/drive/folders/1iyA003EmIkE8yepdXWCwpelQJDYevrHx?usp=sharing',
        image: 'bmb.webp',
      },
      {
        name: 'HTSS map link',
        url: 'https://docs.google.com/document/d/1Pw4qFsKpSVVHXU8VkMfG1zc6waZh1m_GO9rws7DZ8uY/edit?usp=sharing',
        image: 'htss.webp',
      },
      {
        name: 'Collected maps',
        url: 'https://docs.google.com/document/d/1Fcb0S9VGg2mkyM5u1-wGFAnNRSayn3-ik5X9Gk_izkY/edit?usp=drive_link',
        image: 'clt.webp',
      },
    ],
  },
  { name: 'NIKKE', status: 'semi-active', icon: 'nk.webp' },
  { name: 'MahjongSoul', status: 'semi-active', icon: 'mjs.webp' },
  { name: 'Blue Archive', status: 'no', icon: 'ba.webp' },
  { name: 'Project SEKAI', status: 'no', icon: 'pjsk.webp' },
  { name: 'Genshin', status: 'no', icon: 'gs.webp' },
  { name: 'Riichi City', status: 'no', icon: 'rc.webp' },
]
