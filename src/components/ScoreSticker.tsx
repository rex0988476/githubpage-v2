import { scoreTier } from '../lib/anime'

interface ScoreStickerProps {
  score: number | null
  /** on-cover 壓在封面角落，large 用在展開後的標題旁，mini 用在各季 */
  variant: 'on-cover' | 'large' | 'mini'
}

/** 圓形分數貼紙，顏色依分數分級；10 分加一顆星（mini 不加） */
export function ScoreSticker({ score, variant }: ScoreStickerProps) {
  return (
    <span
      className={`score-sticker ${variant}`}
      data-tier={scoreTier(score)}
      aria-label={score === null ? 'Not rated' : `Score ${score}`}
    >
      {score === 10 && variant !== 'mini' && (
        <span className="score-star" aria-hidden="true">
          ★
        </span>
      )}
      {score ?? '-'}
    </span>
  )
}
