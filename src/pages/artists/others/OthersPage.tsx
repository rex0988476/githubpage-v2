import { Link } from 'react-router-dom'
import { eventsOf } from '../../../lib/music'
import type { Artist } from '../../../types'
import { EventRow } from '../shared/EventRow'
import { useEventFocus } from '../shared/useEventFocus'
import { useExpandableRows } from '../shared/useExpandableRows'
import styles from './OthersPage.module.css'

/** 沒辦法歸到某位音樂家的活動：牛皮紙票夾，每則用圖釘釘在上面 */
export default function OthersPage({ artist }: { artist: Artist }) {
  const events = eventsOf(artist.slug)
  const { openEventId, setOpenEventId, toggleEvent } = useExpandableRows()
  useEventFocus(events, openEventId, setOpenEventId)

  return (
    <div className={styles.page}>
      <Link className={styles.back} to="/music">
        ← Music
      </Link>

      <header className={styles.head}>
        <p className={styles.label}>MISC. FILE</p>
        <h1>Others</h1>
        <p className={styles.lead}>其他活動</p>
      </header>

      <section className={styles.board} aria-label="活動紀錄">
        {events.length > 0 ? (
          <ul className={styles.events}>
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                open={event.id === openEventId}
                onToggle={toggleEvent}
                classes={styles}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>活動紀錄整理中</p>
        )}
      </section>
    </div>
  )
}
