import { useState } from 'react'
import { artistImageUrl } from '../../../lib/music'
import type { ArtistPhoto } from '../../../types'
import { Lightbox } from './Lightbox'

/** 拍立得相簿，點照片看大圖 */
interface PhotoGalleryProps {
  photos: ArtistPhoto[]
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

export function PhotoGallery({ photos, classes }: PhotoGalleryProps) {
  const [active, setActive] = useState<ArtistPhoto | null>(null)

  return (
    <div className={classes.collection}>
      <ul className={classes.polaroids}>
        {photos.map((photo) => (
          <li key={photo.image} data-photo={photo.image}>
            <figure className={classes.polaroid}>
              <button
                type="button"
                className={classes.polaroidButton}
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

      <Lightbox photo={active} onClose={() => setActive(null)} classes={classes} />
    </div>
  )
}
