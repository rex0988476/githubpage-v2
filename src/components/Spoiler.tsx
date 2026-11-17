import { useState, type ReactNode } from 'react'

interface SpoilerProps {
  /** 蓋住時顯示的標題，例如 My review、E3 */
  label: string
  className?: string
  children: ReactNode
}

/** 防劇透：內容先糊掉，點了才顯示。蓋住時內容設成 inert，鍵盤和讀螢幕軟體都碰不到 */
export function Spoiler({ label, className, children }: SpoilerProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className={className ? `spoiler ${className}` : 'spoiler'} data-hidden={!revealed || undefined}>
      <div className="spoiler-content" inert={!revealed} aria-hidden={!revealed || undefined}>
        {children}
      </div>
      {!revealed && (
        <button type="button" className="spoiler-cover" onClick={() => setRevealed(true)}>
          <span>
            <strong>{label}</strong>
            <small>May contain spoilers · tap to show</small>
          </span>
        </button>
      )}
    </div>
  )
}
