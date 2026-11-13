/**
 * 沒有專屬頁的演出者的固定顏色，用在 Music 時間軸的日期存根和圓點，白天和夜晚都一樣。
 * key 寫 events.ts 裡 performers 的名字；沒列的會從固定色盤挑一個。
 * 有專屬頁的音樂家用 artists.ts 的 accent，不用寫在這裡。
 * 註解是使用者描述的顏色，色碼由此挑出；沒註解的是使用者直接給的色碼。
 */
export const performerColors: Record<string, string> = {
  '新しい学校のリーダーズ': '#1C2A4A', // 水手服制服深藍
  'milet': '#2F4E8C', // 沒有那麼深的深藍
  'ONE OK ROCK': '#D62828', // 紅
  '藤田麻衣子': '#F4A261', // 淡一點點的橘
  'Reol': '#D8C08A', // 米色偏一點金
  'Ado': '#1D2F6F', // 深藍
  'asmi': '#F48FB1', // 粉紅
  '美波': '#2E7D4F', // 深一點的綠
  'Vaundy': '#F07C1C', // 橘
  'ヨルシカ': '#6EC6F0', // 天藍
  '西川貴教(T.M.Revolution)': '#F28C28', // 橘
  'ASCA': '#C8102E', // 紅
  'GARNiDELiA': '#8E44AD', // 紫
  'nonoc': '#A8E6B0', // 淡綠
  '佐藤純一（fhána）': '#1F6B45', // 深綠
  'sajou no hana': '#7FD3E6', // 水藍
  'RAISE A SUILEN': '#33CCCC',
  'ReoNa': '#B8B2C8', // 有一點點紫色的銀色
  'Ayasa': '#7B4FC9', // 紫
  'REAL AKIBA BOYZ': '#8B5A2B', // 茶褐色
  'MyGO!!!!!': '#3388BB',
  'Ave Mujica': '#881144',
  'sumimi': '#F5D547', // 黃
  'さくらみこ': '#FF9CB4',
  'IRyS': '#E10E5B',
  'YOASOBI': '#F2285A',
  '反田葉月': '#7B5236', // 咖啡色
  'ずっと真夜中でいいのに。': '#6F2ADD',
  'majiko': '#F7E83B', // 檸檬黃
  'tuki.': '#F6D76B', // 月亮黃
  "Poppin'Party": '#FF3377',
  'Afterglow': '#EE3344',
  'Pastel＊Palettes': '#33DDAA',
  'Roselia': '#3344AA',
  'ハロー、ハッピーワールド！': '#FFC02A',
  'Morfonica': '#33AAFF',
  '夢限大みゅーたいぷ': '#EC7384',
  '紫羅蘭永恆花園': '#9270A3',
  '藍井エイル': '#2B6CC4', // 藍
  '小倉唯': '#F8D1F6',
  '佐々木李子': '#BB9955',
  'JO☆STARS': '#6A3FA0', // 紫
  'CHiCO with HoneyWorks': '#E8436B', // 介於粉紅跟紅中間的紅
  '茅原実里': '#CC77FF',
  '仲村宗悟': '#9FADD6',
  '平野綾': '#E53935', // 紅
  '森口博子': '#F2C230', // 黃
}
