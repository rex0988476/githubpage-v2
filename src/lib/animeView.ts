import type { SortKey, SortOrder } from './anime'

export type ViewMode = 'card' | 'list'

/**
 * Anime 頁的瀏覽狀態，存在模組裡：去逐集心得頁再回來（按頁面上的返回或瀏覽器上一頁）時，
 * 排序、模式和展開的作品都照舊，並捲回剛才那部。重新整理網頁就會清掉。
 */
export const animeView: {
  view: ViewMode
  sortKey: SortKey
  order: SortOrder
  expanded: number[]
  /** 回到 Anime 頁時要捲到的作品 */
  focus: number | null
} = {
  view: 'card',
  sortKey: 'score',
  order: 'desc',
  expanded: [],
  focus: null,
}
