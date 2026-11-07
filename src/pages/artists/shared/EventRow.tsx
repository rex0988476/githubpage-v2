import { useRef } from 'react'
import { isUpcoming } from '../../../lib/music'
import type { ArtistEvent } from '../../../types'
import { PhotoGallery } from './PhotoGallery'

interface EventRowProps {
  event: ArtistEvent
  open: boolean
  onToggle: (id: string, row: HTMLElement) => void
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

export function EventRow({ event, open, onToggle, classes }: EventRowProps) {
  const rowRef = useRef<HTMLLIElement>(null)
  const { id, type, date, title, subtitle, review, photos } = event
  const detailId = `${id}-detail`

  return (
    <li ref={rowRef}>
      <div className={classes.eventHead}>
        <div>
          <time dateTime={date}>{date.replaceAll('-', '.')}</time>
          {type === 'concert' && isUpcoming(date) && <span className={classes.upcoming}>即將參戰</span>}
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {(review.length > 0 || photos.length > 0) && (
          <button
            type="button"
            className={classes.eventToggle}
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => {
              if (rowRef.current) onToggle(id, rowRef.current)
            }}
          >
            {open ? '收起 ▲' : '展開 ▼'}
          </button>
        )}
      </div>
      {open && (
        <div id={detailId} className={classes.eventDetail}>
          {review.length > 0 && (
            <div className={classes.storyText}>
              {review.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
          {photos.length > 0 && <PhotoGallery photos={photos} classes={classes} />}
        </div>
      )}
    </li>
  )
}
