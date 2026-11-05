import { useEffect, useRef, useState, type RefObject } from 'react'
import { Carrot } from './Carrot'
import { EmblemMask } from './Emblem'
import styles from './HimehinaPage.module.css'

/** 緞帶尖端停在畫面高度的這個比例 */
const TIP_POSITION = 0.62
/** 取樣間距 px */
const STEP = 8
/** 交叉前後，緞帶最多滑進紙張後面這麼遠 px，越大轉彎越圓 */
const TUCK = 220
/** 蝴蝶結中心的家紋大小 */
const EMBLEM_SIZE = 25

interface Track {
  width: number
  height: number
  red: string
  blue: string
  bows: { x: number; y: number }[]
}

const smoothstep = (value: number) => {
  const t = Math.min(Math.max(value, 0), 1)
  return t * t * (3 - 2 * t)
}

const toPath = (xs: number[]) =>
  xs.map((x, index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${index * STEP}`).join('')

function buildTrack(root: HTMLElement) {
  const origin = root.getBoundingClientRect()
  const sheets = [...root.querySelectorAll('[data-sheet]')].map((sheet) => {
    const box = sheet.getBoundingClientRect()
    return { top: box.top - origin.top, bottom: box.bottom - origin.top, left: box.left - origin.left }
  })
  const width = root.clientWidth
  const height = root.offsetHeight
  const gutter = sheets[0].left
  const left = gutter / 2
  const right = width - gutter / 2
  const wave = Math.min(14, gutter * 0.25)
  const gaps = sheets.slice(1).map((sheet, index) => ({
    from: sheets[index].bottom - Math.min(TUCK, (sheets[index].bottom - sheets[index].top) * 0.4),
    to: sheet.top + Math.min(TUCK, (sheet.bottom - sheet.top) * 0.4),
  }))

  // 緞帶走在紙張兩側，每到區塊之間就左右互換一次
  const redX: number[] = []
  const blueX: number[] = []
  for (let y = 0; y <= height + STEP; y += STEP) {
    const crossed = gaps.reduce((sum, gap) => sum + smoothstep((y - gap.from) / (gap.to - gap.from)), 0)
    const turn = Math.floor(crossed)
    const side = turn % 2 === 0 ? crossed - turn : 1 - (crossed - turn)
    const sway = wave * Math.sin(y / 170) * Math.abs(1 - 2 * side)
    redX.push(left + (right - left) * side + sway)
    blueX.push(right - (right - left) * side - sway)
  }

  const track: Track = {
    width,
    height,
    red: toPath(redX),
    blue: toPath(blueX),
    bows: gaps.map((gap) => ({ x: width / 2, y: (gap.from + gap.to) / 2 })),
  }
  return { track, redX, blueX }
}

/** 紅藍兩條緞帶隨捲動往下，尖端各綁一根蘿蔔 */
export function RibbonTrail({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  const [track, setTrack] = useState<Track | null>(null)
  const revealRef = useRef<SVGRectElement>(null)
  const redTipRef = useRef<SVGGElement>(null)
  const blueTipRef = useRef<SVGGElement>(null)
  const offsetsRef = useRef<{ red: number[]; blue: number[] }>({ red: [], blue: [] })
  const frameRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const placeTip = (tip: SVGGElement | null, xs: number[], y: number) => {
      const index = Math.min(Math.max(Math.round(y / STEP), 1), xs.length - 2)
      const slope = (xs[index + 1] - xs[index - 1]) / (2 * STEP)
      const angle = Math.max(-35, Math.min(35, (-Math.atan(slope) * 180) / Math.PI))
      tip?.setAttribute('transform', `translate(${xs[index]} ${y}) rotate(${angle})`)
    }

    const update = () => {
      frameRef.current = 0
      const height = root.offsetHeight
      const viewport = window.innerHeight
      // 接近頁底時尖端往畫面下緣移動，捲到底剛好抵達終點
      const remaining = height - viewport - window.scrollY
      const ending = Math.min(Math.max(1 - remaining / viewport, 0), 1)
      const tip = reducedMotion
        ? height
        : window.scrollY + viewport * (TIP_POSITION + (1 - TIP_POSITION) * ending)
      const y = Math.min(tip, height - 30)
      revealRef.current?.setAttribute('height', `${reducedMotion ? height : y}`)
      placeTip(redTipRef.current, offsetsRef.current.red, y)
      placeTip(blueTipRef.current, offsetsRef.current.blue, y)
    }

    const requestUpdate = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update)
    }

    const observer = new ResizeObserver(() => {
      const built = buildTrack(root)
      offsetsRef.current = { red: built.redX, blue: built.blueX }
      setTrack(built.track)
      requestUpdate()
    })
    observer.observe(root)
    window.addEventListener('scroll', requestUpdate, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      cancelAnimationFrame(frameRef.current)
    }
  }, [rootRef])

  return (
    <svg
      className={styles.ribbons}
      style={{ height: track?.height }}
      viewBox={track ? `0 0 ${track.width} ${track.height}` : undefined}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="himehina-reveal">
          <rect ref={revealRef} width="100%" height="0" />
        </clipPath>
        <linearGradient id="himehina-halves">
          <stop offset="0.5" stopColor="#e5484d" />
          <stop offset="0.5" stopColor="#3f7fe0" />
        </linearGradient>
        <EmblemMask id="himehina-bow" size={EMBLEM_SIZE} />
      </defs>
      {track && (
        <>
          <g clipPath="url(#himehina-reveal)">
            <path className={styles.ribbonBlue} d={track.blue} />
            <path className={styles.stitch} d={track.blue} />
            <path className={styles.ribbonRed} d={track.red} />
            <path className={styles.stitch} d={track.red} />
            {track.bows.map(({ x, y }) => (
              <g key={y} transform={`translate(${x} ${y}) scale(1.9)`}>
                <path d="M0 0C-10-16-34-18-36-6c-1 10 22 14 36 6" fill="#e5484d" />
                <path d="M0 0C10-16 34-18 36-6c1 10-22 14-36 6" fill="#3f7fe0" />
                <path d="M-3 2-16 26l10-3 5 8 4-27" fill="#e5484d" />
                <path d="M3 2 16 26 6 23l-5 8-4-27" fill="#3f7fe0" />
                <circle r="15" fill="#fff" stroke="#ffb3cc" strokeWidth="2" />
                <rect
                  x={-EMBLEM_SIZE / 2}
                  y={-EMBLEM_SIZE / 2}
                  width={EMBLEM_SIZE}
                  height={EMBLEM_SIZE}
                  fill="url(#himehina-halves)"
                  mask="url(#himehina-bow)"
                />
              </g>
            ))}
          </g>
          <g ref={redTipRef}>
            <Carrot x="-18" y="-7" width="36" height="50" />
          </g>
          <g ref={blueTipRef}>
            <Carrot x="-18" y="-7" width="36" height="50" />
          </g>
        </>
      )}
    </svg>
  )
}
