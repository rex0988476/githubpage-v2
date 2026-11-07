import { useEffect, useRef } from 'react'
import { artistImageUrl } from '../../../lib/music'
import type { ArtistPhoto } from '../../../types'

interface LightboxProps {
  /** 要放大的照片；null 代表關閉 */
  photo: ArtistPhoto | null
  onClose: () => void
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

/** 用原生 dialog 看大圖 */
export function Lightbox({ photo, onClose, classes }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (photo) dialogRef.current?.showModal()
  }, [photo])

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
    >
      {photo && (
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
          {photo.caption && <p>{photo.caption}</p>}
        </div>
      )}
    </dialog>
  )
}
