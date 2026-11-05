import { artistImageUrl } from '../../../lib/music'

const EMBLEM = artistImageUrl('himehina/emblem.png')

/** 家紋圖檔是透明底的單色圖，做成遮罩才能染成任何顏色；以 (0, 0) 為中心 */
export function EmblemMask({ id, size }: { id: string; size: number }) {
  return (
    <mask id={id}>
      <image href={EMBLEM} x={-size / 2} y={-size / 2} width={size} height={size} />
    </mask>
  )
}
