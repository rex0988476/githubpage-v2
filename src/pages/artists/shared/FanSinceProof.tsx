import { useState, type ReactNode } from 'react'
import type { ArtistPhoto } from '../../../types'
import { Lightbox } from './Lightbox'

interface FanSinceProofProps {
  /** 證明截圖；null 就照原樣顯示，不能點 */
  proof: ArtistPhoto | null
  /** 原本 FAN SINCE 區塊的 class，按鈕沿用同一個外觀 */
  className: string
  children: ReactNode
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

/** FAN SINCE 區塊本身就是按鈕，點了放大證明截圖 */
export function FanSinceProof({ proof, className, children, classes }: FanSinceProofProps) {
  const [open, setOpen] = useState(false)

  if (!proof) return <p className={className}>{children}</p>

  return (
    <>
      <button
        type="button"
        className={`${className} ${classes.proofButton}`}
        aria-haspopup="dialog"
        title="看訂閱紀錄"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <Lightbox
        photos={[proof]}
        index={open ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setOpen(false)}
        classes={classes}
      />
    </>
  )
}
