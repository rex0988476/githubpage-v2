import { seasonLabel } from '../lib/anime'
import type { Season } from '../types'

/** 季名；有 strike 的季會加刪除線 */
export function SeasonName({ season, index }: { season: Season; index: number }) {
  const label = seasonLabel(season, index)
  return season.strike ? <s>{label}</s> : label
}
