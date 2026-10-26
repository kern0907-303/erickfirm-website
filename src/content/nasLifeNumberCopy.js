// Existing NAS copy and number profiles gathered from the approved sources:
// NAS-life-number build spec, NAS course pages, and nas-annual-engine rules.
export const MAIN_NUMBER_PROFILES = {
  1: { theme: '啟動', strength: '發起與表達主張', watch: '獨自扛起所有推進' },
  2: { theme: '連結', strength: '協調與建立互信', watch: '過度配合而模糊界線' },
  3: { theme: '表達', strength: '創意、溝通與連結觀點', watch: '同時開太多表達方向' },
  4: { theme: '建構', strength: '穩定流程與累積基礎', watch: '把熟悉流程當成唯一選項' },
  5: { theme: '轉換', strength: '調整、探索與打開新路徑', watch: '變動太快而缺少收斂' },
  6: { theme: '承擔', strength: '照顧責任與維持品質', watch: '把責任擴張成過度承擔' },
  7: { theme: '洞察', strength: '觀察、研究與修正方法', watch: '反覆思考而延後驗證' },
  8: { theme: '成果', strength: '整合資源與推進成果', watch: '把控制感等同於安全' },
  9: { theme: '整合', strength: '收束、整合與完成循環', watch: '尚未收尾就急著開新線' },
};

// Reuse the existing NAS dashboard's six relation explanations; no score or
// weather label is exposed on the new page.
export const DAILY_RELATION_COPY = {
  resonance: '這種日子一年沒幾天，你做起事來會特別順手，適合把拖很久的決定做掉。',
  flow: '你的強項今天比較容易被看見，適合做你本來就擅長的事。',
  help: '這種日子容易遇到願意幫你的人，但你得先開口。',
  calm: '普通的一天，按原本的節奏走就好。',
  trial: '今天走起來會有點卡。降低期待，把小事處理掉就算及格。',
  clash: '話少說、事緩辦，重要的決定挪到明天。',
};

export const NAS_LIFE_NUMBER_COPY = {
  title: '生命數字雙軌計算｜看見你想成為誰，以及你實際上是誰',
  description: '輸入陽曆生日，計算陽曆與陰曆主命數、當前流年與流月，並看見兩條生命軌跡的差異。平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。',
  hook: '你以前算過生命數字嗎？那算的是哪一條？',
  heroSupport: '大部分人只算了最後一層，而且只算了一條軌跡。陽曆是你想成為誰，陰曆是你實際上是誰。',
  completenessHint: '只有陽曆約六成、加農曆約八成五、再加出生時分十成。',
  mainNumberDefinition: '主命數是把西元出生年月日的每一位數字相加、收斂到個位數得到的。它描述的是你這一生最主要會反覆遇到的功課，是題目，不是答案。',
  stuck: '道理你都懂，方法你也試過。卡住的是心裡那一塊怎麼都過不去的地方，然後你開始怪自己不夠堅強。',
  positioning: '課程圍繞四個問題：我是誰、我為什麼會這樣、我現在在哪裡、我接下來該往哪裡走。',
  brand: '平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。',
  annualReport: '依你的生日寫成的一整年地圖：十二個月什麼時候衝、什麼時候收，加上 365 能量氣象台每天的提醒。',
  course: '生命數字 36 堂，看懂你為什麼一直卡在同一個地方。',
  oneToOne: '深度｜主課＋實踐營＋艾瑞克一對一 60 分鐘｜NT$19,800（每梯限 5 名）',
  monthlyTurnRule: '流月逐日套用「當日 >= 生日日取本月，否則取上個月」的公式，再依結果變化推導換期。生日 31 號時，1/31 到 2/28 取一月、3/1 到 3/30 取二月、3/31 到 4/30 取三月、5/1 到 5/30 取四月。',
};

export const FOCUS_OPTIONS = [
  '工作或方向感，一直抓不準',
  '關係裡常常委屈，或覺得耗損',
  '想知道自己到底適合什麼',
  '卡在某個階段，想不出下一步',
];
