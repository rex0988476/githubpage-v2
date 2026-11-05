import type { Concert } from '../../types'

export const concerts: Concert[] = [
  {
    id: 'suisei-once-upon-a-stellar-2026-11-12',
    date: '2026-11-12',
    title: 'HOSHIMACHI SUISEI ARENA TOUR 2026 Once Upon a Stellar',
    venue: '文心秀泰影城',
    city: '台中',
    artistSlugs: ['hoshimachi-suisei'],
    review: [],
    photos: [],
  },
  {
    id: 'suisei-supernova-reboot-2026-02-21',
    date: '2026-02-21',
    title: 'Hoshimachi Suisei Live "SuperNova: REBOOT"',
    venue: '站前秀泰影城',
    city: '台中',
    artistSlugs: ['hoshimachi-suisei'],
    review: [
      '第一次參加星街的演唱會！而且也是我第一次參加hololive的活動，之前因為holo的活動都搶不到已經有點灰心了，甚至會因為怕搶不到導致再一次傷心而刻意不關注holo相關的活動，沒想到真的有成功搶到的一天，雖然不是現地但能參加到真的太高興了😭',
      '星街一如既往地可愛又帥氣，實體馬車超酷，綺麗事的衣服超漂亮，ムーンライト旋律超喜歡，月に向かって撃て還拿大砲出來超嗨😂',
      '整體來說是非常盡興的一場演唱會，雖然是透過螢幕觀賞但我仍然被現場氣氛深深的感染到了，非常感動🥹',
    ],
    photos: [
      {
        image: 'hoshimachi-suisei/supernova-reboot/cinema-standee.jpg',
        alt: 'SuperNova: REBOOT 的影城看板',
        width: 900,
        height: 1600,
        caption: '影城的看板',
      },
      {
        image: 'hoshimachi-suisei/supernova-reboot/bonus-poster.jpg',
        alt: 'SuperNova: REBOOT 的入場特典工藝海報',
        width: 1200,
        height: 1600,
        caption: '特典工藝海報，漂亮得太誇張了，Mika Pikazo是神🛐',
      },
      {
        image: 'hoshimachi-suisei/supernova-reboot/carriage.jpg',
        alt: '星街すいせい站在舞台馬車上揮手的銀幕畫面',
        width: 1600,
        height: 900,
        caption: '馬車上的星街🥰',
      },
      {
        image: 'hoshimachi-suisei/supernova-reboot/end-message.jpg',
        alt: '終演後銀幕上星街すいせい的手寫訊息',
        width: 1600,
        height: 900,
        caption: '終演後メッセージ🥹',
      },
    ],
  },
]
