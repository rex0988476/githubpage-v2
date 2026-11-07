import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { artistImageUrl, type CollectionItem } from '../../../lib/music'
import type { ArtistPhoto } from '../../../types'
import { Lightbox } from './Lightbox'

/** 區塊上先露出的周邊數量 */
const PREVIEW_COUNT = 4

interface CollectionProps {
  slug: string
  /** 已排序的周邊 */
  items: CollectionItem[]
  /** 各音樂家頁自己的 CSS Module */
  classes: CSSModuleClasses
}

const pageUrl = (slug: string) => `/music/artists/${slug}`
const listUrl = (slug: string) => `${pageUrl(slug)}/collection`

function FavoriteHeart({ className }: { className: string }) {
  return (
    <span className={className} role="img" aria-label="最愛">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21C5 15.6 2 12.2 2 8.3 2 5.3 4.3 3 7.2 3c1.9 0 3.7 1 4.8 2.7C13.1 4 14.9 3 16.8 3 19.7 3 22 5.3 22 8.3c0 3.9-3 7.3-10 12.7" />
      </svg>
    </span>
  )
}

function AcquiredOn({ date, classes }: { date: string | null; classes: CSSModuleClasses }) {
  if (!date) return <span className={classes.merchDate}>入手日未知</span>

  return (
    <time className={classes.merchDate} dateTime={date}>
      {date.replaceAll('-', '.')}
    </time>
  )
}

function MerchGrid({ slug, items, classes }: CollectionProps) {
  return (
    <ul className={classes.merchGrid}>
      {items.map((item) => {
        const { photo } = item.photos[0]

        return (
          <li key={item.id}>
            <Link className={classes.merchCard} to={`${listUrl(slug)}/${item.id}`}>
              <img src={artistImageUrl(photo.image)} alt={photo.alt} loading="lazy" />
              {item.favorite && <FavoriteHeart className={classes.merchFavorite} />}
              <strong>{item.name}</strong>
              <AcquiredOn date={item.acquiredOn} classes={classes} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** 頁面上的 Collection 區塊，露出前幾件周邊 */
export function CollectionPreview({ slug, items, classes }: CollectionProps) {
  if (items.length === 0) return null

  return (
    <div className={classes.collection}>
      <h3 className={classes.label}>COLLECTION</h3>
      <MerchGrid slug={slug} items={items.slice(0, PREVIEW_COUNT)} classes={classes} />
      <Link className={classes.merchAll} to={listUrl(slug)}>
        看全部 {items.length} 件周邊 →
      </Link>
    </div>
  )
}

function MerchDetail({ slug, item, classes }: { slug: string; item: CollectionItem; classes: CSSModuleClasses }) {
  const [active, setActive] = useState<ArtistPhoto | null>(null)

  return (
    <>
      <Link className={classes.merchBack} to={listUrl(slug)}>
        ← 全部周邊
      </Link>
      <h2>
        {item.favorite && <FavoriteHeart className={classes.merchFavoriteInline} />}
        {item.name}
      </h2>
      <p className={classes.merchMeta}>
        入手日 <AcquiredOn date={item.acquiredOn} classes={classes} />
      </p>
      <ul className={classes.polaroids}>
        {item.photos.map(({ photo, event }) => (
          <li key={photo.image}>
            <figure className={classes.polaroid}>
              <button
                type="button"
                className={classes.polaroidButton}
                aria-label={`放大：${photo.alt}`}
                onClick={() => setActive(photo)}
              >
                <img src={artistImageUrl(photo.image)} alt={photo.alt} width={photo.width} height={photo.height} />
              </button>
              <figcaption>
                {photo.caption}
                <Link className={classes.merchSource} to={pageUrl(slug)} state={{ focusPhoto: photo.image }}>
                  → {event.title}
                </Link>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox photo={active} onClose={() => setActive(null)} classes={classes} />
    </>
  )
}

/** 網址在 collection 底下時蓋在頁面上，關閉後頁面維持原位 */
export function CollectionDialog({ slug, items, classes }: CollectionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const [section, merchId] = (useParams()['*'] ?? '').split('/')
  const open = section === 'collection' && items.length > 0
  const item = items.find(({ id }) => id === merchId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog?.open) dialog?.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open, merchId])

  useEffect(() => {
    dialogRef.current?.scrollTo(0, 0)
  }, [merchId])

  return (
    <dialog
      ref={dialogRef}
      className={classes.collectionPanel}
      aria-label="周邊收藏"
      onClose={(event) => {
        // 裡面的大圖關閉時事件也會傳到這裡
        if (event.target !== event.currentTarget) return
        // Esc 是瀏覽器直接關閉的，網址要跟上；從周邊退到列表時上面的 effect 會再打開
        if (open) navigate(item ? listUrl(slug) : pageUrl(slug))
      }}
    >
      {open && (
        <div className={classes.collectionBody}>
          <Link className={classes.collectionClose} to={pageUrl(slug)} aria-label="關閉">
            ✕
          </Link>
          {item ? (
            <MerchDetail slug={slug} item={item} classes={classes} />
          ) : (
            <>
              <h2>COLLECTION</h2>
              <p className={classes.merchMeta}>{items.length} 件周邊</p>
              <MerchGrid slug={slug} items={items} classes={classes} />
            </>
          )}
        </div>
      )}
    </dialog>
  )
}
