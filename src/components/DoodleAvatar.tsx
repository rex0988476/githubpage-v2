import { useEffect, useRef, type CSSProperties } from 'react'

// 從 public/images/bocchi_normal_a.png 描出來的線條，用來做逐筆畫出的動畫。
const body =
  'M75 80 91 63 96 61 101 56 108 52 120 50 124 48 144 49 157 52 160 54 175 56 180 59 192 62 215 77 228 90 228 92 234 99 243 123 243 127 245 130 245 138 249 149 249 183 245 191 245 194 243 196 243 200 241 204 227 218 221 221 202 221 193 214 191 214 185 220 169 220 162 217 153 209 150 209 143 214 127 219 108 219 103 217 97 211 93 209 89 209 84 212 79 213 62 213 51 205 46 195 46 168 49 162 49 153 53 144 57 142'
const tails = [
  'M18 123 20 118 26 111 34 108 47 108 53 110 56 113 62 113',
  'M20 122 21 120 25 121 30 118 38 117 42 115 54 115 55 114',
]
const blueClip = 'M75 85 65 80 60 79 54 80 42 103 44 105 48 105 57 109 67 111 73 103 73 91 75 89 Z'
const yellowClip = 'M47 139 44 134 44 128 42 126 42 119 44 117 65 116 66 117 66 137 64 139 Z'
const leftEye = 'M100 95 127 101 133 104 129 110 122 111 100 121'
const rightEye = 'M199 95 187 95 183 97 179 97 176 100 166 104 164 107 170 108 182 114 189 115 199 119'
const mouth = 'M172 135 171 134 150 134 139 137 138 145 135 149 135 153 133 156 133 169 134 170 176 170 177 169 177 152 172 143 Z'

/** 每一筆開始畫的時間和花的時間（秒） */
const draw = (delay: number, time = 0.3) =>
  ({ '--draw-delay': `${delay}s`, '--draw-time': `${time}s` }) as CSSProperties

const soundUrl = `${import.meta.env.BASE_URL}sounds/bocchi_sound.mp3`
/** 音檔開頭約 0.05 秒是靜音，播放時跳過 */
const soundOffset = 0.04

/**
 * 用 Web Audio 播放，手機上比 Audio 元素快很多。
 * 音檔在頁面載入時先抓好；AudioContext 要等使用者碰到頭像才建立，瀏覽器才允許出聲。
 */
function usePokeSound() {
  const fileRef = useRef<Promise<ArrayBuffer> | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<Promise<AudioBuffer> | null>(null)
  const playingRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    fileRef.current = fetch(soundUrl).then((res) => res.arrayBuffer())
    fileRef.current.catch(() => {})
    return () => void ctxRef.current?.close()
  }, [])

  const prepare = () => {
    if (ctxRef.current || typeof AudioContext === 'undefined') return
    const ctx = new AudioContext()
    ctxRef.current = ctx
    bufferRef.current = (fileRef.current ?? fetch(soundUrl).then((res) => res.arrayBuffer())).then((file) =>
      ctx.decodeAudioData(file.slice(0)),
    )
  }

  const play = async () => {
    prepare()
    const ctx = ctxRef.current
    if (!ctx || !bufferRef.current) {
      void new Audio(soundUrl).play().catch(() => {})
      return
    }
    try {
      if (ctx.state !== 'running') void ctx.resume()
      const source = ctx.createBufferSource()
      source.buffer = await bufferRef.current
      source.connect(ctx.destination)
      // 上一次還沒播完就先停掉，從頭重播
      playingRef.current?.stop()
      playingRef.current = source
      source.start(0, soundOffset)
    } catch {
      // 解碼或播放失敗就安靜地略過
    }
  }

  return { prepare, play }
}

/** 被戳的時候壓扁再彈回來 */
const poke: Keyframe[] = [
  { transform: 'none' },
  { transform: 'scale(1.12, 0.84)', offset: 0.25 },
  { transform: 'scale(0.94, 1.08)', offset: 0.55 },
  { transform: 'scale(1.02, 0.98)', offset: 0.8 },
  { transform: 'none' },
]

export function DoodleAvatar({ label }: { label: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const sound = usePokeSound()

  const handleClick = () => {
    void sound.play()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svgRef.current?.animate(poke, { duration: 450, easing: 'ease-out' })
    }
  }

  return (
    <button
      type="button"
      className="doodle-button"
      aria-label={`${label} (click to play a sound)`}
      onPointerDown={sound.prepare}
      onClick={handleClick}
    >
      <svg ref={svgRef} className="doodle" viewBox="10 40 250 190" aria-hidden="true">
        <g className="doodle-wobble">
          <g className="doodle-pink">
            <path className="doodle-line" pathLength={1} d={body} style={draw(0.2, 1.3)} />
            {tails.map((d, i) => (
              <path key={d} className="doodle-line" pathLength={1} d={d} style={draw(1.5 + i * 0.15)} />
            ))}
          </g>
          <g className="doodle-clip">
            <path className="doodle-line doodle-blue" pathLength={1} d={blueClip} style={draw(1.9)} />
            <path className="doodle-line doodle-yellow" pathLength={1} d={yellowClip} style={draw(2.1)} />
          </g>
          <g className="doodle-face">
            <g className="doodle-eyes">
              <path className="doodle-line" pathLength={1} d={leftEye} style={draw(2.4)} />
              <path className="doodle-line" pathLength={1} d={rightEye} style={draw(2.6)} />
            </g>
            <path className="doodle-line" pathLength={1} d={mouth} style={draw(2.85, 0.45)} />
          </g>
        </g>
      </svg>
    </button>
  )
}

/** 導覽列用的小頭像：同一組線條，不畫動畫 */
export function DoodleMark() {
  return (
    <svg className="doodle-mark" viewBox="10 40 250 190" aria-hidden="true">
      <g stroke="#ffaec9">
        <path d={body} />
        {tails.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={blueClip} stroke="#00a2e8" />
      <path d={yellowClip} stroke="#f5d800" />
      <path d={leftEye} />
      <path d={rightEye} />
      <path d={mouth} />
    </svg>
  )
}
