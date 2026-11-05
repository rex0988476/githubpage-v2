import type { SVGProps } from 'react'

/** 自己繪製的蘿蔔小圖示 */
export function Carrot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 44" aria-hidden="true" {...props}>
      <path d="M16 15C13 9 8 7 5 8c1 4 5 8 11 8" fill="#58b368" />
      <path d="M16 15c3-6 8-8 11-7-1 4-5 8-11 8" fill="#3f9d55" />
      <path d="M16 16c-2-5-2-10 0-14 2 4 2 9 0 14" fill="#6cc47c" />
      <path d="M7 19c0-3 4-5 9-5s9 2 9 5c0 6-3 15-6 20-1 2-2 3-3 3s-2-1-3-3c-3-5-6-14-6-20" fill="#ff9a3d" />
      <path
        d="M9 22h5M21 27h-5M11 31h4"
        fill="none"
        stroke="#e87a1e"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}
