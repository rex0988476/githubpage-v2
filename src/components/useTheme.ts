import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const storageKey = 'theme'
const darkQuery = '(prefers-color-scheme: dark)'

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const systemTheme = (): Theme => (window.matchMedia(darkQuery).matches ? 'dark' : 'light')

/**
 * 白天／夜晚主題。沒選過就跟系統設定，選過就記在 localStorage。
 * 只在共用外框掛載時把 data-theme 加到 <html>，音樂家頁沒有外框，所以維持原本的配色。
 * 第一次畫面的主題由 index.html 裡的小腳本先設好，避免閃一下白。
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ?? systemTheme())

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    return () => {
      delete root.dataset.theme
    }
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia(darkQuery)
    const follow = () => {
      if (!savedTheme()) setTheme(systemTheme())
    }
    media.addEventListener('change', follow)
    return () => media.removeEventListener('change', follow)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(storageKey, next)
    } catch {
      // 無痕模式等情況存不了就算了
    }
  }

  return { theme, toggle }
}
