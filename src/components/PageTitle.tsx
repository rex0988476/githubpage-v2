import type { CSSProperties } from 'react'

interface PageTitleProps {
  title: string
  emoji: string
  /** 紙片顏色，用 index.css 裡的變數名稱，例如 --sky-soft */
  tone: string
  /** 紙膠帶的條紋顏色 */
  tape: 'pink' | 'yellow' | 'orange' | 'green' | 'sky'
}

/** 頁面標題：寫在彩色紙片上、用紙膠帶貼在點格紙上，emoji 是旁邊的小貼紙 */
const tapeColors: Record<PageTitleProps['tape'], string> = {
  pink: 'rgba(255, 174, 201, 0.75)',
  yellow: 'rgba(246, 205, 82, 0.8)',
  orange: 'rgba(247, 158, 79, 0.8)',
  green: 'rgba(120, 196, 98, 0.8)',
  sky: 'rgba(120, 172, 235, 0.75)',
}

export function PageTitle({ title, emoji, tone, tape }: PageTitleProps) {
  return (
    <header className="page-title" style={{ '--tag': `var(${tone})`, '--tape': tapeColors[tape] } as CSSProperties}>
      <h1>
        {title}
        <span className="page-title-emoji" aria-hidden="true">
          {emoji}
        </span>
      </h1>
    </header>
  )
}
