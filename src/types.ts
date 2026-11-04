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
