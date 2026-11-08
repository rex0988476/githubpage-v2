import type { CSSProperties } from 'react'

// 從 public/images/bocchi_normal_a.png 描出來的線條，用來做逐筆畫出的動畫。
const body =
  'M57 142 53 144 49 153 49 162 46 168 46 195 51 205 62 213 79 213 84 212 89 209 93 209 97 211 103 217 108 219 127 219 143 214 150 209 153 209 162 217 169 220 185 220 191 214 193 214 202 221 221 221 227 218 241 204 243 200 243 196 245 194 245 191 249 183 249 149 245 138 245 130 243 127 243 123 234 99 228 92 228 90 215 77 192 62 180 59 175 56 160 54 157 52 144 49 124 48 120 50 108 52 101 56 96 61 91 63 75 80'
const tails = [
  'M18 123 20 118 26 111 34 108 47 108 53 110 56 113 62 113',
  'M20 122 21 120 25 121 30 118 38 117 42 115 54 115 55 114',
]
const blueClip = 'M75 85 65 80 60 79 54 80 42 103 44 105 48 105 57 109 67 111 73 103 73 91 75 89 Z'
const yellowClip = 'M47 139 44 134 44 128 42 126 42 119 44 117 65 116 66 117 66 137 64 139 Z'
const leftEye = 'M100 95 127 101 133 104 129 110 122 111 100 121'
const rightEye = 'M199 119 189 115 182 114 170 108 164 107 166 104 176 100 179 97 183 97 187 95 199 95'
const mouth = 'M172 135 171 134 150 134 139 137 138 145 135 149 135 153 133 156 133 169 134 170 176 170 177 169 177 152 172 143 Z'

/** 每一筆開始畫的時間和花的時間（秒） */
const draw = (delay: number, time = 0.3) =>
  ({ '--draw-delay': `${delay}s`, '--draw-time': `${time}s` }) as CSSProperties

export function DoodleAvatar({ label }: { label: string }) {
  return (
    <svg className="doodle" viewBox="10 40 250 190" role="img" aria-label={label}>
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
  )
}
