import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ArtistEvent } from '../../../types'

/** 標亮照片的時間 ms */
const FOCUS_TIME = 2400

interface FocusState {
  /** 從 Collection 點照片的貼文連結回來 */
  focusPhoto?: string
  /** 從 Music 總覽點演唱會票根過來 */
  focusEvent?: string
}

/** 展開指定的活動並捲過去；從照片過來時再短暫標亮那張照片 */
export function useEventFocus(
  events: ArtistEvent[],
  openEventId: string | null,
  openEvent: (id: string) => void,
) {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const { focusPhoto: image, focusEvent } = (state as FocusState | null) ?? {}

  useEffect(() => {
    if (!image && !focusEvent) return

    const event = image
      ? events.find((item) => item.photos.some((photo) => photo.image === image))
      : events.find((item) => item.id === focusEvent)
    const expandable = event && (event.review.length > 0 || event.photos.length > 0)
    // 活動展開後照片才存在，等下一次畫面更新再捲動
    if (event && expandable && event.id !== openEventId) {
      openEvent(event.id)
      return
    }

    if (image) {
      const photo = document.querySelector<HTMLElement>(`[data-photo="${CSS.escape(image)}"]`)
      photo?.scrollIntoView({ block: 'center', behavior: 'instant' })
      photo?.setAttribute('data-focused', '')
      setTimeout(() => photo?.removeAttribute('data-focused'), FOCUS_TIME)
    } else if (event) {
      const row = document.querySelector<HTMLElement>(`[data-event="${CSS.escape(event.id)}"]`)
      // 留出左上角「← Music」按鈕的高度，日期才不會被蓋住
      if (row) window.scrollTo({ top: row.getBoundingClientRect().top + window.scrollY - 80, behavior: 'instant' })
    }
    // 清掉 state，重新整理時才不會再跳一次
    navigate(pathname, { replace: true, state: null })
  }, [image, focusEvent, events, openEventId, openEvent, navigate, pathname])
}
