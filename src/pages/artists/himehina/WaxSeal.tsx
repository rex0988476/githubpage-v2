import { EmblemMask } from './Emblem'
import styles from './HimehinaPage.module.css'

const MARK = 66

/** 信末的紅色封蠟，中間壓著家紋 */
export function WaxSeal() {
  const mark = { x: -MARK / 2, y: -MARK / 2, width: MARK, height: MARK, mask: 'url(#himehina-seal)' }

  return (
    <svg className={styles.seal} viewBox="-60 -60 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="himehina-wax" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#f0606a" />
          <stop offset="0.55" stopColor="#d9323f" />
          <stop offset="1" stopColor="#ad1f2d" />
        </radialGradient>
        <EmblemMask id="himehina-seal" size={MARK} />
      </defs>
      <path
        d="M2-56c10-2 16 5 25 7s18 3 22 12 0 16 3 25 8 15 4 24-13 10-19 18-12 16-23 16-16-7-25-9-19-3-24-12 0-16-4-25-9-15-5-24 13-11 19-19 12-13 27-13z"
        fill="url(#himehina-wax)"
      />
      <circle r="41" fill="#c42835" stroke="#a51c29" strokeWidth="2.5" />
      <g transform="translate(0.9 1.1)">
        <rect {...mark} fill="#ee7a82" />
      </g>
      <rect {...mark} fill="#8e1420" />
    </svg>
  )
}
