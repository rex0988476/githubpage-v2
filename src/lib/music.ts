import { concerts } from '../data/music/concerts'

export const artistImageUrl = (image: string) => `${import.meta.env.BASE_URL}artists/${image}`

/** 某位音樂家的參戰紀錄，新的在前 */
export const concertsOf = (slug: string) =>
  concerts
    .filter((concert) => concert.artistSlugs.includes(slug))
    .sort((a, b) => b.date.localeCompare(a.date))

/** 場次還沒結束：演出當天仍算，隔天才不算。日期依訪客當地時間。 */
export const isUpcoming = (date: string) => date >= new Date().toLocaleDateString('sv-SE')
