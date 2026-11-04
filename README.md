# githubpage-v2

rex0988476 的個人網站，用 React + TypeScript + Vite 重寫。

## 開發

```sh
npm install
npm run dev      # 本地開發，存檔後自動更新
npm run build    # 型別檢查並輸出到 dist/
npm run preview  # 預覽 build 結果
npm run lint
```

## 更新內容

| 內容 | 檔案 |
|---|---|
| 動畫清單 | `src/data/anime.json` |
| 動畫封面 | `public/covers/<id>.<副檔名>` |
| 遊戲清單 | `src/data/games.ts` |
| 自我介紹、興趣 | `src/data/profile.ts` |

### 新增一部動畫

在 `src/data/anime.json` 加一筆，並把封面放進 `public/covers/`：

```json
{
  "id": 51,
  "title": "動畫名稱",
  "cover": "51.jpg",
  "score": 8,
  "tags": ["奇幻"],
  "review": "心得，沒有就填 null",
  "seasons": [
    { "year": 2026, "watched": 12, "total": 12, "score": 8 }
  ]
}
```

未知或尚未評分的值填 `null`。`id` 不可重複。

## 部署

push 到 `main` 後，`.github/workflows/deploy.yml` 會自動建置並部署。
第一次要到 GitHub repo 的 Settings → Pages，把 Source 設成 **GitHub Actions**。
