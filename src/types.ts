export interface Season {
  year: number
  /** 看過的集數；null 代表未知（例如尚未開播） */
  watched: number | null
  /** 總集數；null 代表未知 */
  total: number | null
  /** 該季評分；null 代表未評分 */
  score: number | null
}

export interface Anime {
  id: number
  title: string
  /** public/covers/ 底下的檔名 */
  cover: string
  /** 總評分；null 代表未評分 */
  score: number | null
  tags: string[]
  review: string | null
  seasons: Season[]
}

export type GameStatus = 'active' | 'semi-active' | 'no'

export interface Game {
  name: string
  status: GameStatus
}

export interface FavoriteSong {
  title: string
  /** 官方 YouTube 影片 ID */
  videoId: string
  year: number
  /** 作詞作曲，翻唱則填原曲的歌手或創作者；null 代表未知 */
  credit: string | null
}

export interface ArtistPhoto {
  /** public/artists/ 底下的路徑 */
  image: string
  alt: string
  width: number
  height: number
  /** 照片說明；null 代表沒有 */
  caption: string | null
}

export interface Artist {
  /** 網址用的識別字：#/music/artists/<slug> */
  slug: string
  name: string
  /** 總覽頁卡片的強調色 */
  accent: string
  youtube: string
  /** public/artists/ 底下的形象照檔名；null 代表還沒有 */
  image: string | null
  /** 自己寫的感想，一個元素一段；空陣列代表不顯示 */
  story: string[]
  /** 周邊等個人照片；空陣列代表不顯示 */
  gallery: ArtistPhoto[]
  favoriteSongs: FavoriteSong[]
  /** 喜歡的翻唱，影片在本人或合作對象的官方頻道 */
  coverSongs: FavoriteSong[]
}

export interface Concert {
  id: string
  /** YYYY-MM-DD */
  date: string
  title: string
  venue: string | null
  city: string | null
  /** 一場可以有多位音樂家，例如音樂祭 */
  artistSlugs: string[]
}
