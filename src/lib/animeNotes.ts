/**
 * 逐集心得：src/data/anime-notes/<動畫 id>.md，一個 `## S1 E3` 標題就是一集。
 * 只有單季的作品可以省略季，寫 `## E3`；標題後面可以接日期（2026-11-20）和小標題。
 * `## 總覽`（或 `## Overview`）是對整部作品的心得，排在最前面。
 * 特別篇把 E 換成種類：`## OVA1`、`## S2 番外1`，排在那一季正篇的後面。
 * 照片寫成單獨一段的 `![說明](檔名.jpg)`，檔案在 public/anime/<id>/，副檔名一律換成 .webp。
 */

// 只取得清單，檔案內容等到打開那一頁才載入
const files = import.meta.glob<string>('../data/anime-notes/*.md', {
  query: '?raw',
  import: 'default',
})

const loaders = new Map<number, () => Promise<string>>()
for (const [path, load] of Object.entries(files)) {
  const id = Number(path.match(/(\d+)\.md$/)?.[1])
  if (Number.isInteger(id)) loaders.set(id, load)
}

export const hasNotes = (id: number) => loaders.has(id)

export interface NotePhoto {
  /** 完整網址 */
  image: string
  alt: string
  caption: string | null
}

export type NoteBlock = { kind: 'text'; text: string } | { kind: 'photos'; photos: NotePhoto[] }

export interface EpisodeNote {
  /** 網址用的代號，例如 s1e3、overview；同一集寫了兩次的第二篇是 s1e3-2 */
  key: string
  /** 對整部作品的心得；這時 season 是 0、episode 是空字串 */
  overview: boolean
  /** 特別篇的種類，例如 OVA、番外；正篇是 null */
  kind: string | null
  season: number
  episode: string
  date: string | null
  title: string | null
  blocks: NoteBlock[]
}

const tail = String.raw`(?:\s+(\d{4}-\d{2}-\d{2}))?(?:\s+(.+?))?\s*$`
// 種類是 E 就是正篇；其他文字（OVA、番外、總集篇⋯）是特別篇
const headingPattern = new RegExp(
  String.raw`^##\s+(?:S(\d+)\s*)?(E|[^\s\d]+?)\s*(\d+(?:\.\d+)?)` + tail,
  'i',
)
const overviewPattern = new RegExp(String.raw`^##\s+(?:總覽|overview)` + tail, 'i')
const imagePattern = /^!\[([^\]]*)\]\(([^)\s]+)\)$/

const photoUrl = (id: number, file: string) =>
  `${import.meta.env.BASE_URL}anime/${id}/${file.replace(/\.[^./]+$/, '')}.webp`

function parseBlocks(id: number, body: string): NoteBlock[] {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): NoteBlock => {
      const lines = block.split('\n').map((line) => line.trim())
      const images = lines.map((line) => line.match(imagePattern))
      if (images.every(Boolean)) {
        return {
          kind: 'photos',
          photos: images.map((match) => ({
            image: photoUrl(id, match![2]),
            alt: match![1],
            caption: match![1] || null,
          })),
        }
      }
      return { kind: 'text', text: block }
    })
}

export function parseNotes(id: number, source: string): EpisodeNote[] {
  const notes: EpisodeNote[] = []
  let current: { note: EpisodeNote; body: string[] } | null = null
  const flush = () => {
    if (current) current.note.blocks = parseBlocks(id, current.body.join('\n'))
  }

  // 第一個標題之前的文字不顯示，可以拿來寫給自己的備註
  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    const overview = line.match(overviewPattern)
    const match = overview ? null : line.match(headingPattern)
    if (!overview && !match) {
      current?.body.push(line)
      continue
    }
    flush()
    const season = overview ? 0 : Number(match![1] ?? 1)
    const kind = match && match[2].toUpperCase() !== 'E' ? match[2] : null
    const episode = match ? match[3] : ''
    const [date, title] = overview ? [overview[1], overview[2]] : [match![4], match![5]]
    const base = overview
      ? 'overview'
      : `s${season}${kind ? kind.toLowerCase() : 'e'}${episode}`
    const repeats = notes.filter((note) => note.key.split('-')[0] === base).length
    current = {
      note: {
        key: repeats ? `${base}-${repeats + 1}` : base,
        overview: Boolean(overview),
        kind,
        season,
        episode,
        date: date ?? null,
        title: title ?? null,
        blocks: [],
      },
      body: [],
    }
    notes.push(current.note)
  }
  flush()

  // 總覽最前面，接著依季排：正篇照集數，特別篇排在那季正篇後面、照寫的順序
  return notes
    .map((note, index) => ({ note, index }))
    .sort(
      (a, b) =>
        a.note.season - b.note.season ||
        Number(Boolean(a.note.kind)) - Number(Boolean(b.note.kind)) ||
        (a.note.kind || b.note.kind ? 0 : Number(a.note.episode) - Number(b.note.episode)) ||
        a.index - b.index,
    )
    .map(({ note }) => note)
}

export async function loadNotes(id: number): Promise<EpisodeNote[] | null> {
  const load = loaders.get(id)
  return load ? parseNotes(id, await load()) : null
}
