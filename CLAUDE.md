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
- 路由在 `src/App.tsx`；共用外框在 `src/components/Layout.tsx`。音樂家頁 `#/music/artists/<slug>` 不套共用外框。
- 樣式在 `src/index.css`，顏色和間距用 `:root` 的變數，配色沿用舊站。音樂家專屬頁例外：各自用 CSS Module，避免樣式互相污染。
- 音樂家專屬頁放在 `src/pages/artists/<slug>/`，在 `src/pages/ArtistPage.tsx` 註冊並按需載入。
- 歌曲列、活動列、相簿、Collection 和展開狀態在 `src/pages/artists/shared/`，各頁用 `classes` 傳入自己的 CSS Module，只共用行為不共用外觀。
- 歌曲清單固定最大高度，超過就在欄內捲動。清單的 `ul` 要加 `data-scroller`，`useExpandableRows` 靠它分開處理頁面和清單的捲動。
- Collection 由網址控制（`#/music/artists/<slug>/collection/<周邊 id>`），用 `dialog` 蓋在音樂家頁上，所以 `ScrollToTop` 在同一位音樂家底下不回頂端。周邊照片點下去是放大，點說明下方的貼文連結才會用 `focusPhoto` state 回到頁面，`useEventFocus` 負責展開活動並捲到照片。
- 動畫的排序和計算邏輯集中在 `src/lib/anime.ts`，元件不要自己算。

## 資料

- 動畫：`src/data/anime.json`，型別在 `src/types.ts`，直接打包進 JS，不用 fetch。
- 封面：`public/covers/<id>.<副檔名>`，由 `cover` 欄位對應，不靠順序。
- 未知或未評分的值填 `null`。`null` 不論升降冪都排最後。
- 尚未開播的季（`watched` 和 `total` 為 `null`）會讓該部動畫的進度和總集數變成未知，這是刻意的行為。
- 舊 Excel 已停用，不要再把資料同步回去。
- 遊戲：`src/data/games.ts`；自我介紹和興趣：`src/data/profile.ts`。
- 音樂家：`src/data/music/artists.ts`；形象照：`public/artists/<檔名>`，由 `image` 欄位對應。
- 音樂家個人照片：`public/artists/<slug>/`，由活動的 `photos` 對應。原圖先放 `photos-inbox/`（不進 git），清除 EXIF 並壓縮到長邊 1600px 後才放進 public。
- 活動紀錄：`src/data/music/events.ts`，用 `artistSlugs` 關聯音樂家，`type` 分 `concert` 和 `other`，`subtitle` 是標題下方的文字（演唱會放場地和城市），`review` 和 `photos` 是內文與照片，有內容才會出現展開按鈕，音樂家頁會自動列出。
- 周邊：`src/data/music/merch.ts`，照片用 `merchIds` 對應。周邊照片只來自活動紀錄，沒有照片的周邊不會顯示。`favorite` 的周邊在 Collection 置頂，其餘依入手日新到舊，`null` 排最後。
- `日本音樂家List.json` 和 `music-extract.json` 是未 commit 的本地來源資料，共 284 位音樂家，圖片網址指向 localhost，不能直接用。

## 已做的決定

- 使用者選擇直接維護 JSON，不保留 Excel 轉檔流程。
- Sing 等其他興趣目前只是首頁圖示，沒有頁面。
- 284 位音樂家都要有獨立頁面，一位一位加；每位有不同的強烈背景設計。
- 音樂家頁放名稱、形象照片、開始追的日期與天數、使用者自己寫的感想、周邊收藏（選填）、喜歡的歌列表、活動紀錄，不寫客觀介紹文或年表。感想由使用者提供，不要代寫。
- 音樂家頁的背景視覺自己繪製，歌曲用官方 YouTube 嵌入（沒有官方影片的歌由使用者指定影片，並在頁尾說明），並標示為個人粉絲頁。形象照由使用者提供，不要自行下載官方圖。
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
- HIMEHINA 頁其他場次的心得和照片，等使用者提供。
- 星街すいせい頁 11/12 場的心得和照片，等使用者提供。
- Music 總覽的演唱會區塊還沒做，等使用者整理資料。
- BanG Dream! Ave Mujica：舊資料有封面（`../githubpage/anime_covers/`）但沒有動畫資料，等使用者提供分數和進度。
- 51 部中有 46 部還沒有 `tags`。
- 封面總共約 16MB，之後可以壓縮。
- `© 2025` 沿用舊站，可能需要更新。
