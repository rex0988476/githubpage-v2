import { events } from '../data/music/events'
import { merch } from '../data/music/merch'
import type { ArtistEvent, ArtistPhoto, Merch } from '../types'

export interface CollectionItem extends Merch {
  /** 這件周邊的照片和它所在的活動，新的活動在前 */
  photos: { photo: ArtistPhoto; event: ArtistEvent }[]
}

export const artistImageUrl = (image: string) => `${import.meta.env.BASE_URL}artists/${image}`

/** 某位音樂家的活動紀錄，新的在前 */
export const eventsOf = (slug: string) =>
  events
    .filter((event) => event.artistSlugs.includes(slug))
    .sort((a, b) => b.date.localeCompare(a.date))

/** 某位音樂家的周邊：最愛置頂，再依入手日新到舊，未知排最後。沒有照片的周邊不列出。 */
export const collectionOf = (slug: string): CollectionItem[] => {
  const artistEvents = eventsOf(slug)

  return merch
    .filter((item) => item.artistSlugs.includes(slug))
    .map((item) => ({
      ...item,
      photos: artistEvents.flatMap((event) =>
        event.photos
          .filter((photo) => photo.merchIds?.includes(item.id))
          .map((photo) => ({ photo, event })),
      ),
    }))
    .filter((item) => item.photos.length > 0)
    .sort(
      (a, b) =>
        Number(b.favorite) - Number(a.favorite) ||
        Number(b.acquiredOn !== null) - Number(a.acquiredOn !== null) ||
        (b.acquiredOn ?? '').localeCompare(a.acquiredOn ?? ''),
    )
}

const today = () => new Date().toLocaleDateString('sv-SE')

/** 從某天到今天過了幾天，依訪客當地日期 */
export const daysSince = (date: string) => (Date.parse(today()) - Date.parse(date)) / 86_400_000

/** 今年，依訪客當地日期 */
export const currentYear = () => today().slice(0, 4)

/** 場次還沒結束：演出當天仍算，隔天才不算。日期依訪客當地時間。 */
export const isUpcoming = (date: string) => date >= today()

/** Music 總覽的演唱會時間軸，一律新到舊，分成還沒到和已參加 */
export const concertTimeline = () => {
  const concerts = events
    .filter((event) => event.type === 'concert')
    .sort((a, b) => b.date.localeCompare(a.date))
  return {
    upcoming: concerts.filter((event) => isUpcoming(event.date)),
    past: concerts.filter((event) => !isUpcoming(event.date)),
  }
}
