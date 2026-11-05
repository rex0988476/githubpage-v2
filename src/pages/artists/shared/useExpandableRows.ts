import { useState } from 'react'
import { flushSync } from 'react-dom'

/** 歌曲同時只播一首、演唱會同時只展開一場 */
export function useExpandableRows() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [openConcertId, setOpenConcertId] = useState<string | null>(null)

  // 收起上方的影片會讓版面上移，補回捲動量讓點擊的那一列留在原位
  // 列在 data-scroller 清單裡時，頁面跟著清單走，列的位移由清單自己補
  const keepInPlace = (row: HTMLElement, update: () => void) => {
    const scroller = row.closest<HTMLElement>('[data-scroller]')
    const anchor = scroller ?? row
    const top = () => anchor.getBoundingClientRect().top
    const offset = () => row.getBoundingClientRect().top - top()
    const anchorTop = top()
    const rowOffset = offset()

    flushSync(update)
    window.scrollBy({ top: top() - anchorTop, behavior: 'instant' })
    if (!scroller) return

    scroller.scrollBy({ top: offset() - rowOffset, behavior: 'instant' })
    const hidden = row.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom
    if (hidden > 0) scroller.scrollBy({ top: hidden + 6, behavior: 'instant' })
  }

  const play = (videoId: string, row: HTMLElement) => {
    keepInPlace(row, () => setPlayingId(videoId))
  }

  const toggleConcert = (id: string, row: HTMLElement) => {
    keepInPlace(row, () => setOpenConcertId((current) => (current === id ? null : id)))
  }

  return { playingId, openConcertId, play, toggleConcert }
}
