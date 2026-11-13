import type { Anime, Season } from '../types'

export type SortKey = 'score' | 'progress' | 'episodes' | 'firstYear' | 'lastYear'
export type SortOrder = 'asc' | 'desc'

export const coverUrl = (anime: Anime) => `${import.meta.env.BASE_URL}covers/${anime.cover}`

/** 所有季還沒看的集數；任何一季資料未知就回傳 null */
export function unwatchedEpisodes(anime: Anime): number | null {
  let sum = 0
  for (const { watched, total } of anime.seasons) {
    if (watched === null || total === null) return null
    sum += total - watched
  }
  return sum
}

/** 所有季的總集數；任何一季資料未知就回傳 null */
export function totalEpisodes(anime: Anime): number | null {
  let sum = 0
  for (const { total } of anime.seasons) {
    if (total === null) return null
    sum += total
  }
  return sum
}

function sortValue(anime: Anime, key: SortKey): number | null {
  switch (key) {
    case 'score':
      return anime.score
    case 'progress': {
      // 取負值：升冪時沒看的最多（進度最少）排最前面
      const unwatched = unwatchedEpisodes(anime)
      return unwatched === null ? null : -unwatched
    }
    case 'episodes':
      return totalEpisodes(anime)
    case 'firstYear':
      return anime.seasons[0].year
    case 'lastYear':
      return anime.seasons[anime.seasons.length - 1].year
  }
}

/** 回傳排序後的新陣列；未知值不論升降冪都排最後 */
export function sortAnime(list: Anime[], key: SortKey, order: SortOrder): Anime[] {
  const direction = order === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    const va = sortValue(a, key)
    const vb = sortValue(b, key)
    if (va === null && vb === null) return 0
    if (va === null) return 1
    if (vb === null) return -1
    return (va - vb) * direction
  })
}

/** 目前排序依據的顯示文字 */
export function sortLabel(anime: Anime, key: SortKey): string {
  switch (key) {
    case 'score':
      return anime.score === null ? '-' : String(anime.score)
    case 'progress': {
      const unwatched = unwatchedEpisodes(anime)
      if (unwatched === null) return '-'
      return unwatched === 0 ? 'done' : `${unwatched} left`
    }
    case 'episodes': {
      const total = totalEpisodes(anime)
      return total === null ? '-' : `${total} ep`
    }
    case 'firstYear':
    case 'lastYear':
      return String(sortValue(anime, key))
  }
}

export const seasonProgress = ({ watched, total }: Season) =>
  watched === null || total === null ? '-' : `${watched} / ${total}`

/** 第一個還沒看完的季；全部看完回傳 null */
export function currentSeason(anime: Anime): { index: number; season: Season } | null {
  const index = anime.seasons.findIndex(
    ({ watched, total }) => watched === null || total === null || watched < total,
  )
  return index === -1 ? null : { index, season: anime.seasons[index] }
}

export type ChipKind = 'watching' | 'done' | 'plain'

/** 卡片封面上的標籤：只顯示目前排序的值；依分數排序時不顯示，因為已經有分數貼紙 */
export function coverChip(anime: Anime, key: SortKey): { text: string; kind: ChipKind } | null {
  if (key === 'score') return null
  if (key !== 'progress') return { text: sortLabel(anime, key), kind: 'plain' }
  const current = currentSeason(anime)
  if (!current) return { text: 'Completed', kind: 'done' }
  const { index, season } = current
  const label = `S${index + 1}`
  if (season.watched === null || season.total === null) {
    return { text: `${label} · upcoming`, kind: 'watching' }
  }
  return { text: `${label} · ${season.watched}/${season.total}`, kind: 'watching' }
}

export type ScoreTier = 'perfect' | 'great' | 'good' | 'plain'

/** 分數貼紙的顏色等級 */
export function scoreTier(score: number | null): ScoreTier {
  if (score === null) return 'plain'
  if (score >= 10) return 'perfect'
  if (score >= 9) return 'great'
  if (score >= 8) return 'good'
  return 'plain'
}

/** 依 id 決定卡片的小角度，同一部每次都一樣 */
export const cardTilt = (anime: Anime) => (((anime.id * 37) % 5) - 2) * 0.6
