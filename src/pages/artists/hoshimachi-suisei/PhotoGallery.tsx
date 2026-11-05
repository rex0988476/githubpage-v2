import { useEffect, useRef, useState } from 'react'
import { artistImageUrl } from '../../../lib/music'
import type { ArtistPhoto } from '../../../types'
import styles from './SuiseiPage.module.css'

/** 拍立得相簿，點照片用原生 dialog 看大圖 */
export function PhotoGallery({ photos, title }: { photos: ArtistPhoto[]; title?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<ArtistPhoto | null>(null)

  useEffect(() => {
    if (active) dialogRef.current?.showModal()
  }, [active])

  return (
    <div className={styles.collection}>
      {title && <h3 className={styles.label}>{title}</h3>}
      <ul className={styles.polaroids}>
        {photos.map((photo) => (
          <li key={photo.image}>
            <figure className={styles.polaroid}>
              <button
                type="button"
                className={styles.polaroidButton}
                aria-label={`放大：${photo.alt}`}
                onClick={() => setActive(photo)}
              >
                <img
                  src={artistImageUrl(photo.image)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                />
              </button>
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="照片大圖"
        onClose={() => setActive(null)}
        onClick={(event) => {
          // 點到照片外的背景就關閉
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        {active && (
          <div className={styles.lightboxBody}>
            <button
              type="button"
              className={styles.lightboxClose}
              aria-label="關閉"
              onClick={() => dialogRef.current?.close()}
            >
              ✕
            </button>
            <img src={artistImageUrl(active.image)} alt={active.alt} />
            {active.caption && <p>{active.caption}</p>}
          </div>
        )}
      </dialog>
    </div>
  )
}
