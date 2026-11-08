import { useEffect, useRef } from 'react'
import { artistImageUrl } from '../../../lib/music'
import type { ArtistPhoto } from '../../../types'

interface LightboxProps {
  /** 可以左右切換的照片，通常是同一篇貼文的照片 */
  photos: ArtistPhoto[]
  /** 正在看的照片位置；null 代表關閉 */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

/** 用原生 dialog 看大圖，可用兩側按鈕或方向鍵切換 */
export function Lightbox({ photos, index, onIndexChange, onClose, classes }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const open = index !== null
  const photo = open ? photos[index] : undefined
  const hasPrev = open && index > 0
  const hasNext = open && index < photos.length - 1

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) dialog.showModal()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={classes.lightbox}
      aria-label="照片大圖"
      onClose={onClose}
      onClick={(event) => {
        // 點到照片外的背景就關閉
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      onKeyDown={(event) => {
        if (index === null) return
        if (event.key === 'ArrowLeft' && hasPrev) onIndexChange(index - 1)
        if (event.key === 'ArrowRight' && hasNext) onIndexChange(index + 1)
      }}
    >
      {photo && index !== null && (
        <div className={classes.lightboxBody}>
          <button
            type="button"
            className={classes.lightboxClose}
            aria-label="關閉"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
          <img src={artistImageUrl(photo.image)} alt={photo.alt} />
          {/* 按鈕固定在畫面兩側，照片直橫不同時位置也不會跳 */}
          {hasPrev && (
            <button
              type="button"
              className={`${classes.lightboxNav} ${classes.lightboxPrev}`}
              aria-label="上一張"
              onClick={() => onIndexChange(index - 1)}
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              className={`${classes.lightboxNav} ${classes.lightboxNext}`}
              aria-label="下一張"
              onClick={() => onIndexChange(index + 1)}
            >
              ›
            </button>
          )}
          {photo.caption && <p>{photo.caption}</p>}
          {photos.length > 1 && (
            <span className={classes.lightboxCount}>
              {index + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </dialog>
  )
}
