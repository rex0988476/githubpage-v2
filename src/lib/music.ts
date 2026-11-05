import { concerts } from '../data/music/concerts'

export const artistImageUrl = (image: string) => `${import.meta.env.BASE_URL}artists/${image}`

/** 某位音樂家的參戰紀錄，新的在前 */
export const concertsOf = (slug: string) =>
  concerts
    .filter((concert) => concert.artistSlugs.includes(slug))
    .sort((a, b) => b.date.localeCompare(a.date))

const today = () => new Date().toLocaleDateString('sv-SE')

/** 從某天到今天過了幾天，依訪客當地日期 */
export const daysSince = (date: string) => (Date.parse(today()) - Date.parse(date)) / 86_400_000

/** 場次還沒結束：演出當天仍算，隔天才不算。日期依訪客當地時間。 */
export const isUpcoming = (date: string) => date >= today()
