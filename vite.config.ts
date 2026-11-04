import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 相對路徑：不管部署在網域根目錄或 /githubpage-v2/ 底下都能運作
export default defineConfig({
  base: './',
  plugins: [react()],
})
