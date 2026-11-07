// 三個品牌頁面各自的對外身份：頁首 logo 與名稱、選單、頁尾、分頁標題、分享預覽的網站名稱。
// 規則：/nas、/abl、/i8 底下的頁面只出現該品牌，不出現 Erick Firm 的 logo 與其他品牌連結。
// 網址（erickfirm.com）避不開，所以頁尾用 relation 這一句說明品牌和 Erick Firm 的關係。
// 這個檔案只能是純 JS（不要放 JSX），scripts/prerender-shell.js 也會讀它。

export const BRANDS = {
  nas: {
    key: 'nas',
    name: '平衡空間',
    logo: '/logo-nas.png',
    home: '/nas',
    relation: '平衡空間是艾瑞克的生命數字品牌，網站與結帳由艾瑞克的工作室 Erick Firm 統一管理。',
    nav: [
      { to: '/nas', label: '平衡空間' },
      { to: '/nas/calculator', label: '生命數字計算' },
      { to: '/nas/quiz', label: '卡點檢查' },
      { to: '/nas/2027', label: '2027 年度導航' },
      { to: '/nas/about', label: '認識艾瑞克' },
    ],
    legal: [
      { to: '/nas/terms', label: '服務條款' },
      { to: '/nas/privacy', label: '隱私權政策' },
    ],
  },
  abl: {
    key: 'abl',
    name: '艾伯林量子調頻',
    logo: '/logo-abl.jpg',
    home: '/abl',
    relation: '艾伯林量子調頻是艾瑞克的狀態調和品牌，網站與結帳由艾瑞克的工作室 Erick Firm 統一管理。',
    nav: [
      { to: '/abl', label: '艾伯林量子調頻' },
      { to: '/abl/2027', label: '2027 年度頻率' },
      { to: '/abl/space', label: '空間調頻' },
    ],
    legal: [
      { to: '/abl/terms', label: '服務條款' },
      { to: '/abl/privacy', label: '隱私權政策' },
    ],
  },
  i8: {
    key: 'i8',
    name: '初八企業顧問',
    logo: '/logo-i8.png',
    home: '/i8',
    relation: '初八企業顧問是艾瑞克的企業顧問品牌，網站由艾瑞克的工作室 Erick Firm 統一管理。',
    nav: [{ to: '/i8', label: '初八企業顧問' }],
    legal: [],
  },
};

/**
 * 依路徑找出所屬品牌；不在三個品牌底下（首頁、文章、關於）回傳 null，維持 Erick Firm。
 * @param {string} pathname
 */
export const brandFor = (pathname = '') => {
  const m = String(pathname).match(/^\/(nas|abl|i8)(\/|$)/);
  return m ? BRANDS[m[1]] : null;
};
