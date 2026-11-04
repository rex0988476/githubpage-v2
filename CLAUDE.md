# githubpage-v2

rex0988476 的個人網站，從舊專案 `../githubpage`（純 HTML/JS，執行時讀 Excel）用 React 重寫。
舊專案仍在線上，不要修改它；資料一律以這個專案為準。

## 指令

- `npm run dev`：本地開發
- `npm run build`：型別檢查並建置到 `dist/`
- `npm run lint`：oxlint

專案沒有測試框架。改動後至少跑 build 和 lint，介面改動要在瀏覽器確認，包含約 390px 的手機寬度。

## 架構

- React + TypeScript + Vite，靜態部署到 GitHub Pages。
- `vite.config.ts` 的 `base: './'` 搭配 `HashRouter`：Pages 沒有伺服器端路由，網址形式是 `#/anime`。
- public 底下的資源要用 `import.meta.env.BASE_URL` 組路徑，不要寫 `/covers/...` 這種絕對路徑。
- 路由在 `src/App.tsx`；共用外框在 `src/components/Layout.tsx`。
- 所有樣式在 `src/index.css`，顏色和間距用 `:root` 的變數，配色沿用舊站。
- 動畫的排序和計算邏輯集中在 `src/lib/anime.ts`，元件不要自己算。

## 資料

- 動畫：`src/data/anime.json`，型別在 `src/types.ts`，直接打包進 JS，不用 fetch。
- 封面：`public/covers/<id>.<副檔名>`，由 `cover` 欄位對應，不靠順序。
- 未知或未評分的值填 `null`。`null` 不論升降冪都排最後。
- 尚未開播的季（`watched` 和 `total` 為 `null`）會讓該部動畫的進度和總集數變成未知，這是刻意的行為。
- 舊 Excel 已停用，不要再把資料同步回去。
- 遊戲：`src/data/games.ts`；自我介紹和興趣：`src/data/profile.ts`。

## 已做的決定

- 使用者選擇直接維護 JSON，不保留 Excel 轉檔流程。
- 第一版只做首頁、動畫、遊戲三頁。Music、Sing 等興趣目前只是首頁圖示，沒有頁面。
- 進度排序的升冪是「剩餘集數最多的在前」，與舊站相同。
- 清單模式依評分或進度排序時不另外顯示排序值欄位，因為表格已有對應欄位。

## 待處理

- 尚未上線：GitHub repo 還沒建立，`.github/workflows/deploy.yml` 也還沒實際跑過。
  建立公開 repo 要由使用者確認或親自執行：
  ```sh
  gh repo create rex0988476/githubpage-v2 --public --source . --remote origin
  gh api -X POST repos/rex0988476/githubpage-v2/pages -f build_type=workflow
  git push -u origin main
  ```
- BanG Dream! Ave Mujica：舊資料有封面（`../githubpage/anime_covers/`）但沒有動畫資料，等使用者提供分數和進度。
- 51 部中有 46 部還沒有 `tags`。
- 封面總共約 16MB，之後可以壓縮。
- `Age: 23` 和 `© 2025` 沿用舊站，可能需要更新。
