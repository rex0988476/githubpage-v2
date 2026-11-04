import { useEffect, useRef, type RefObject } from 'react'
import styles from './SuiseiPage.module.css'

/** 彗星頭停在畫面高度的這個比例 */
const HEAD_POSITION = 0.6
const SAMPLES = 400
/** 相鄰轉折點至少往下這麼多 px */
const MIN_STEP = 120

const SVG_NS = 'http://www.w3.org/2000/svg'

function buildPath(root: HTMLElement, acts: HTMLElement[], width: number, height: number) {
  const points = acts.map((act) => ({
    x: width * (act.dataset.side === 'left' ? 0.06 : 0.94),
    y: act.offsetTop + act.offsetHeight / 2,
  }))
  points.push({ x: width / 2, y: height })

  // 彗尾從第一段的光點出發
  const spark = root.querySelector('[data-spark]')?.getBoundingClientRect()
  const origin = root.getBoundingClientRect()
  let previous = spark
    ? { x: spark.left + spark.width / 2 - origin.left, y: spark.top + spark.height / 2 - origin.top }
    : { x: width / 2, y: 0 }
  let path = `M${previous.x} ${previous.y}`
  for (const { x, y: targetY } of points) {
    // 路徑必須一路往下，捲動位置才對得上
    const y = Math.max(targetY, previous.y + MIN_STEP)
    const middle = (previous.y + y) / 2
    path += ` C${previous.x} ${middle} ${x} ${middle} ${x} ${y}`
    previous = { x, y }
  }
  return path
}

/** 彗尾：隨捲動畫出，並依各段的 data-trail 換色。超新星段的爆發大小也在這裡更新。 */
export function CometTrail({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGCircleElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const frameRef = useRef(0)
  const trackRef = useRef<{ samples: { length: number; y: number }[]; total: number }>({
    samples: [],
    total: 0,
  })

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const head = headRef.current
    const gradient = gradientRef.current
    if (!root || !svg || !path || !head || !gradient) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      frameRef.current = 0
      if (reducedMotion) return

      const { samples, total } = trackRef.current

      // 接近頁底時彗星頭往畫面下緣移動，捲到底剛好抵達終點
      const viewport = window.innerHeight
      const remaining = root.scrollHeight - viewport - window.scrollY
      const ending = Math.min(Math.max(1 - remaining / viewport, 0), 1)
      const target = window.scrollY + viewport * (HEAD_POSITION + (1 - HEAD_POSITION) * ending)
      const next = samples.findIndex((sample) => sample.y >= target)
      let length = total
      if (next === 0) length = 0
      else if (next > 0) {
        const before = samples[next - 1]
        const after = samples[next]
        const ratio = (target - before.y) / (after.y - before.y || 1)
        length = before.length + (after.length - before.length) * ratio
      }

      path.style.strokeDashoffset = `${total - length}`
      const point = path.getPointAtLength(length)
      head.setAttribute('cx', `${point.x}`)
      head.setAttribute('cy', `${point.y}`)

      const nova = root.querySelector<HTMLElement>('[data-nova]')
      if (nova) {
        const top = nova.offsetTop - window.scrollY
        const progress = 1 - top / window.innerHeight
        nova.style.setProperty('--burst', `${Math.min(Math.max(progress, 0), 1)}`)
      }
    }

    const requestUpdate = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update)
    }

    const layout = () => {
      const width = root.clientWidth
      const height = root.scrollHeight
      const acts = [...root.querySelectorAll<HTMLElement>('[data-act]')]

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.style.height = `${height}px`
      gradient.setAttribute('y2', `${height}`)
      path.setAttribute('d', buildPath(root, acts, width, height))

      gradient.replaceChildren(
        ...acts.flatMap((act) =>
          [act.offsetTop, act.offsetTop + act.offsetHeight].map((y) => {
            const stop = document.createElementNS(SVG_NS, 'stop')
            stop.setAttribute('offset', `${y / height}`)
            stop.setAttribute('stop-color', act.dataset.trail ?? '#fff')
            return stop
          }),
        ),
      )

      const total = path.getTotalLength()
      const samples = Array.from({ length: SAMPLES + 1 }, (_, index) => {
        const length = (total * index) / SAMPLES
        return { length, y: path.getPointAtLength(length).y }
      })
      trackRef.current = { samples, total }
      path.style.strokeDasharray = reducedMotion ? 'none' : `${total}`
      head.style.display = reducedMotion ? 'none' : ''
      requestUpdate()
    }

    const observer = new ResizeObserver(layout)
    observer.observe(root)
    window.addEventListener('scroll', requestUpdate, { passive: true })
    layout()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      cancelAnimationFrame(frameRef.current)
    }
  }, [rootRef])

  return (
    <svg ref={svgRef} className={styles.trail} aria-hidden="true">
      <defs>
        <linearGradient
          ref={gradientRef}
          id="suisei-trail"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        />
      </defs>
      <path ref={pathRef} stroke="url(#suisei-trail)" />
      <circle ref={headRef} r="6" />
    </svg>
  )
}
