# githubpage-v2

rex0988476 的個人網站，從舊專案 `../githubpage`（純 HTML/JS，執行時讀 Excel）用 React 重寫。
舊專案仍在線上，不要修改它；資料一律以這個專案為準。

## 指令

- `npm run dev`：本地開發
- `npm run build`：型別檢查並建置到 `dist/`
- `npm run lint`：oxlint

專案沒有測試框架。改動後至少跑 build 和 lint，介面改動要在瀏覽器確認，包含約 390px 的手機寬度。

## 部署

- 已上線：https://rex0988476.github.io/githubpage-v2/ ，push 到 `main` 就會由 `.github/workflows/deploy.yml` 自動部署。

## 架構

- React + TypeScript + Vite，靜態部署到 GitHub Pages。
- `vite.config.ts` 的 `base: './'` 搭配 `HashRouter`：Pages 沒有伺服器端路由，網址形式是 `#/anime`。
- public 底下的資源要用 `import.meta.env.BASE_URL` 組路徑，不要寫 `/covers/...` 這種絕對路徑。
- 路由在 `src/App.tsx`；共用外框在 `src/components/Layout.tsx`。音樂家頁 `#/music/artists/<slug>` 不套共用外框。
- 樣式在 `src/index.css`，顏色和間距用 `:root` 的變數，配色沿用舊站。音樂家專屬頁例外：各自用 CSS Module，避免樣式互相污染。
- 白天／夜晚主題：`:root[data-theme='dark']` 覆寫同一組變數，切換邏輯在 `src/components/useTheme.ts`，只有共用外框的頁面會切換。新樣式的顏色一律用變數（如 `var(--surface)`、`var(--ink)`），不要直接寫 `#fff` 這類色碼，否則夜晚版會出現亮白色塊；只有放在固定彩色底上的白字可以寫死。
- hover 效果要包在 `@media (hover: hover)` 裡，否則手機點一下會一直停在 hover 狀態。
- Anime、Games、Music 頁用 `.paper-page` 點格紙背景，標題用 `src/components/PageTitle.tsx`（彩色紙片加一條紙膠帶），紙片顏色 `tone` 和紙膠帶 `tape` 在各頁設定。
- 音樂家專屬頁放在 `src/pages/artists/<slug>/`，在 `src/pages/ArtistPage.tsx` 註冊並按需載入。
- 歌曲列、活動列、相簿、Collection 和展開狀態在 `src/pages/artists/shared/`，各頁用 `classes` 傳入自己的 CSS Module，只共用行為不共用外觀。
- 歌曲清單固定最大高度，超過就在欄內捲動。清單的 `ul` 要加 `data-scroller`，`useExpandableRows` 靠它分開處理頁面和清單的捲動。
- Collection 由網址控制（`#/music/artists/<slug>/collection/<周邊 id>`），用 `dialog` 蓋在音樂家頁上，所以 `ScrollToTop` 在同一位音樂家底下不回頂端。周邊照片點下去是放大，點說明下方的貼文連結才會用 `focusPhoto` state 回到頁面，`useEventFocus` 負責展開活動並捲到照片。
- 動畫的排序和計算邏輯集中在 `src/lib/anime.ts`，元件不要自己算。
- Anime 頁標題下方有三張數字卡（作品數、全部看完的作品數、看過的正篇集數加 extras 合計），由 `animeStats` 從 `anime.json` 自動算出。使用者不要觀看時間和平均分數。
- 動畫卡片是白邊貼紙，角度由 id 決定（`cardTilt`）；右上角的分數貼紙依分數分色（10 金色加星、9 粉、8 紫、其餘白，`scoreTier`），封面左下角的標籤只顯示目前排序的值（`coverChip`）：依進度排序時沒看完的標目前那一季、看完的標 Completed（綠底），依集數或年份排序時標排序值，依分數排序時不顯示；除了 Completed 是淡綠底，其餘都是淡藍底。
- 展開後的內容在 `src/components/AnimeDetails.tsx`，卡片和清單模式共用：標題旁是大的分數貼紙，各季一列（季名用選填的 `name`，沒填顯示 S1、S2；季名欄跟著最長的名稱變寬、進度條縮短，太長就在空格或「、」後換行；手機上有季名的作品改成季名在進度條上方獨立一行）進度條（看完綠、未完藍、正在播且總集數未知是藍色斜紋並顯示「14 / ?」、未播出是虛線，`seasonState`）加該季的小分數貼紙，集數下方的「+1 番外」「+1 OVA」這類標籤來自該季選填的 `extras`，心得是貼了紙膠帶的便條紙。分數貼紙統一用 `src/components/ScoreSticker.tsx`。
- 首頁頭像 `src/components/DoodleAvatar.tsx` 是從 `public/images/bocchi_normal_a.png` 描出來的 SVG 線條（逐筆畫出的動畫、點擊播 `public/sounds/bocchi_sound.mp3`），不是直接顯示 PNG。換頭像時只換 PNG 不會改到首頁，要重新描線；favicon 也是從這張 PNG 做的。

## 資料

- 動畫：`src/data/anime.json`，型別在 `src/types.ts`，直接打包進 JS，不用 fetch。
- 封面：`public/covers/<id>.webp`，由 `cover` 欄位對應，不靠順序。新封面保留原解析度（寬約 460px）轉成 WebP（品質 82）並清掉圖片資訊，原圖移到 `photos-inbox/covers/`。
- 未知或未評分的值填 `null`。`null` 不論升降冪都排最後。
- 尚未開播的季（`watched` 和 `total` 為 `null`）、正在播但總集數未知的季（只有 `total` 為 `null`）都會讓該部動畫的進度和總集數變成未知，這是刻意的行為。
- 集數只算官方的正篇（電視播出、官方算在集數裡的第 0 話也算）；番外、OVA、總集篇等填在該季選填的 `extras`（例如 `{"OVA": 1}`，key 照使用者寫的種類，會直接顯示；OAD 一律記成 OVA），都不影響進度、總集數和排序。
- 舊 Excel 已停用，不要再把資料同步回去。
- 遊戲：`src/data/games.ts`，`active` 放在上方的 Dock，`semi-active` 和 `no` 一起放在 Game library。icon 由使用者提供，放 `public/games/`，由 `icon` 欄位對應；統一轉成 200×200 的 WebP 並清掉圖片資訊（原圖有透明的部分就保留透明，不要補白底），原圖移到 `photos-inbox/games/`。沒有 icon 的遊戲會顯示名稱縮寫方塊。
- 主機遊戲不用正方形 icon，改填 `cover`（盒裝封面，轉成 200×300 的 WebP），會在 Game library 裡另分一組 Console，其餘是 Mobile & PC；沒有遊戲的組不顯示。外觀和 icon 一樣只有白邊和圓角，使用者不要平台色帶之類的裝飾。
- 遊戲的 `platforms`（`mobile`、`pc`、`wii`、`switch`、`ps4`）每款都要填，Game library 的兩組各自用它篩選（Mobile & PC 分 Mobile／PC，Console 分 Wii／Switch／PS4）；Active 也填，但不顯示篩選。新增平台時改 `GamePlatform` 型別和 `GamesPage.tsx` 的 `libraryGroups`。
- 遊戲名稱在中文字之間不換行，長名稱用 `​` 標出換行位置，例如 `'世界計畫​繽紛舞台！​feat. 初音未來'`。
- 遊戲的 `links` 會讓 icon 變成按鈕，點了跳出連結視窗（目前只有 osu!），連結的圖示放 `public/links/`，轉成 144×144 的 WebP。
- 首頁的社群連結在 `src/data/profile.ts` 的 `socialLinks`，圖示和品牌色來自 `simple-icons` 套件。
- 自我介紹和興趣：`src/data/profile.ts`。
- 音樂家：`src/data/music/artists.ts`；形象照：`public/artists/<檔名>`，由 `image` 欄位對應。Music 總覽的卡片是拍立得，照片用 `image`，紙膠帶顏色用 `accent`，下方顯示 `fanSince` 的年份；沒有形象照時用 `accent` 底加名字第一個字。
- Music 總覽在音樂家上方有 Concerts 區塊，自動列出 `events.ts` 裡所有 `concert` 和 `fanmeeting`（`concertTimeline`），做成單欄時間軸，一律新到舊；上方有年份篩選膠囊（All 和各年份，預設今年，沒有今年就用最新的一年），選的年份放在網址 `?year=`，從音樂家頁回來時保留。每場是票根，日期存根是實色、白天夜晚一樣，字色依底色自動選黑或白（`inkOn`）：活動有 `color`（音樂祭、聯合公演用）就用它，否則有專屬頁的用 `accent`，沒有的用 `src/data/music/performers.ts` 的 `performerColors`（key 是 performers 裡的名字），都沒指定就依名字從固定色盤挑。演出者顯示成一排小標籤，底色是各自的代表色（同樣的優先順序，但不看活動的 `color`），字色自動選黑或白。只有一位演出者且有專屬頁時整張票根可點；多位時改成點有專屬頁的名字。點了用 `focusEvent` state 跳到該音樂家頁並展開那場（`useEventFocus`）。
- Others（slug `others`，`category: true`）是放在音樂家牆最後的分類頁，不是真的音樂家：收沒辦法歸到某位音樂家的活動（例如動畫音樂會），在 `performers` 加 `'others'` 就會列進去。`others` 不會在票根上顯示成演出者，只有它一個專屬頁時整張票根連過去；Artists 的數量不算它。頁面在 `src/pages/artists/others/`，牛皮紙票夾風格。
- 音樂家個人照片：`public/artists/<slug>/`，由活動的 `photos` 對應。原圖先放 `photos-inbox/`（不進 git），清除 EXIF 並壓縮到長邊 1600px 後才放進 public。
- 活動紀錄：`src/data/music/events.ts`，`performers` 依順序列演出者：有專屬頁的寫 slug，還沒有的直接寫名字（之後做了專屬頁就把名字換成 slug）。`type` 分 `concert`、`fanmeeting`（粉絲見面會，票根和活動列會加 Fan Meeting 標籤）和 `other`，`subtitle` 是標題下方的文字（演唱會放場地和城市），`review` 和 `photos` 是內文與照片，有內容才會出現展開按鈕，音樂家頁會自動列出。
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
- Anime 工具列只有一行：排序膠囊（點目前的排序就反轉升降冪，箭頭標示方向）、一顆 Expand／Collapse all、Card／List 切換，不放在白色面板裡。

## 待處理

- HIMEHINA 頁其他場次的心得和照片，等使用者提供。
- 星街すいせい頁 11/12 場的心得和照片，等使用者提供。
- 73 部中有 68 部還沒有 `tags`。
- 動畫可能漏記的額外篇章，使用者說先不加，之後再確認有沒有看過：鏈鋸人《蕾潔篇》劇場版（2025）、在地下城尋求邂逅是否搞錯了什麼《獵戶座之矢》劇場版（2019）、美少女戰士 R／S／SuperS 劇場版和短篇《亞美的初戀》、Fate/strange Fake 特別篇〈Whispers of Dawn〉（2023）、我獨自升級劇場版《ReAwakening》（2024）、怪獸8號總集篇劇場版和同場短篇《保科的休假》（2025）、《劇場版 咒術迴戰 0》（2021）、我們仍未知道那天所看見的花名。劇場版（2013）、黑執事第二季 OVA（愛麗絲夢遊仙境等）、OVA《Book of Murder》前後篇（2014～2015）、劇場版《Book of the Atlantic》（2017）、《劇場版 SPY×FAMILY CODE: White》（2023）。
- 2026-11-14 檢查全部動畫後還沒確認的：
  - 鬼滅之刃劇場版無限列車篇（2020）、無限城篇第一章（2025）。
  - 可能漏記的 OVA／劇場版／衍生作：紫羅蘭永恆花園外傳劇場版（2019）、劇場版（2020）；刀劍神域 Extra Edition、Ordinal Scale、Progressive 劇場版；孤獨搖滾總集篇劇場版前後篇（2024）；MyGO 總集篇劇場版前後篇（2025）；為美好的世界獻上祝福！劇場版紅傳說（2019）、外傳《為美好的世界獻上爆焰！》（2023，12 話，可另開一部）；K 劇場版 Missing Kings（2014）、Seven Stories（2018）；花開物語劇場版（2013）；科學超電磁砲 OVA；哥布林殺手劇場版 Goblin's Crown（2020）；NO GAME NO LIFE 劇場版 Zero（2017）；關於我轉生變成史萊姆這檔事劇場版紅蓮之絆篇（2022）；中二病也想談戀愛！劇場版 Take On Me（2018）；文豪Stray Dogs 劇場版 DEAD APPLE（2018）；搖曳露營△劇場版（2022）。
