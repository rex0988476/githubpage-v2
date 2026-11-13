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

/** Game library 篩選用的平台 */
export type GamePlatform = 'mobile' | 'pc' | 'wii' | 'switch' | 'ps4'

export interface GameLink {
  name: string
  url: string
  /** 自己準備的圖示，public/links/ 底下的檔名 */
  image: string
}

export interface Game {
  name: string
  status: GameStatus
  /** 可以在哪些平台玩，Game library 依這個篩選；Active 不分平台，但也照實填 */
  platforms?: GamePlatform[]
  /** 點 icon 會跳出的相關連結，例如自己做的譜面 */
  links?: GameLink[]
  /** public/games/ 底下的 icon 檔名 */
  icon?: string
  /** 主機遊戲的盒裝封面，public/games/ 底下的檔名；有填就排在 Console，照封面比例顯示 */
  cover?: string
  /** 沒有 icon 時，縮寫方塊的底色；沒填就依名稱自動挑 */
  color?: string
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
  /** 照片裡的周邊，對應 merch.ts 的 id；沒有就是一般照片 */
  merchIds?: string[]
}

export interface Merch {
  id: string
  name: string
  /** 入手日 YYYY-MM-DD；null 代表未知，排在最後 */
  acquiredOn: string | null
  /** 最愛的周邊在 Collection 置頂 */
  favorite: boolean
  /** 一件周邊可以有多位音樂家，例如聯名商品 */
  artistSlugs: string[]
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
  /** 開始追的日期 YYYY-MM-DD；null 代表不顯示 */
  fanSince: string | null
  /** 點 FAN SINCE 會放大的證明截圖；null 代表不能點 */
  fanSinceProof: ArtistPhoto | null
  /** 自己寫的感想，一個元素一段；空陣列代表不顯示 */
  story: string[]
  favoriteSongs: FavoriteSong[]
  /** 喜歡的翻唱，影片在本人或合作對象的官方頻道 */
  coverSongs: FavoriteSong[]
  /**
   * 不是真的音樂家，只用來收沒辦法歸類的活動（Others）。
   * 票根上不列出這個名字，Artists 的數量也不算它。
   */
  category?: boolean
}

export interface ArtistEvent {
  id: string
  /** 演唱會和粉絲見面會會出現在 Music 總覽的時間軸，也會顯示「即將參戰」 */
  type: 'concert' | 'fanmeeting' | 'other'
  /** YYYY-MM-DD */
  date: string
  title: string
  /** 標題下方的文字，演唱會放場地和城市；null 代表沒有 */
  subtitle: string | null
  /**
   * 演出者，依順序列出：有專屬頁的寫 slug，還沒有的直接寫名字。
   * 之後替某人做了專屬頁，把名字換成 slug 就會連到他的頁面。
   */
  performers: string[]
  /** 自己寫的內文，一個元素一段；空陣列代表沒有 */
  review: string[]
  /** 周邊和活動的照片都放這裡；空陣列代表沒有 */
  photos: ArtistPhoto[]
}
