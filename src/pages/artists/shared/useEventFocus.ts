import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ArtistEvent } from '../../../types'

/** 標亮照片的時間 ms */
const FOCUS_TIME = 2400

/** 從 Collection 點照片回來時，展開該則活動、捲到照片並短暫標亮 */
export function useEventFocus(
  events: ArtistEvent[],
  openEventId: string | null,
  openEvent: (id: string) => void,
) {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const image = (state as { focusPhoto?: string } | null)?.focusPhoto

  useEffect(() => {
    if (!image) return

    const event = events.find((item) => item.photos.some((photo) => photo.image === image))
    // 活動展開後照片才存在，等下一次畫面更新再捲動
    if (event && event.id !== openEventId) {
      openEvent(event.id)
      return
    }

    const photo = document.querySelector<HTMLElement>(`[data-photo="${CSS.escape(image)}"]`)
    photo?.scrollIntoView({ block: 'center', behavior: 'instant' })
    photo?.setAttribute('data-focused', '')
    setTimeout(() => photo?.removeAttribute('data-focused'), FOCUS_TIME)
    // 清掉 state，重新整理時才不會再跳一次
    navigate(pathname, { replace: true, state: null })
  }, [image, events, openEventId, openEvent, navigate, pathname])
}
