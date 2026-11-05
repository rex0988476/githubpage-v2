import { useRef } from 'react'
import { isUpcoming } from '../../../lib/music'
import type { Concert } from '../../../types'
import { PhotoGallery } from './PhotoGallery'

interface ConcertRowProps {
  concert: Concert
  open: boolean
  onToggle: (id: string, row: HTMLElement) => void
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

export function ConcertRow({ concert, open, onToggle, classes }: ConcertRowProps) {
  const rowRef = useRef<HTMLLIElement>(null)
  const { id, date, title, venue, city, review, photos } = concert
  const detailId = `${id}-detail`

  return (
    <li ref={rowRef}>
      <div className={classes.concertHead}>
        <div>
          <time dateTime={date}>{date.replaceAll('-', '.')}</time>
          {isUpcoming(date) && <span className={classes.upcoming}>即將參戰</span>}
          <h3>{title}</h3>
          <p>{[venue, city].filter(Boolean).join(' · ')}</p>
        </div>
        {(review.length > 0 || photos.length > 0) && (
          <button
            type="button"
            className={classes.concertToggle}
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
        <div id={detailId} className={classes.concertDetail}>
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
