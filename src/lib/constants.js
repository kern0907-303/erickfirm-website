// 全站核心配置與私域引流參數
export const LINE_CONFIG = {
  // 官方帳號基本 ID。舊的 U4744aca... 已失效，不要再使用。
  LINE_BASIC_ID: '@709krpyl',

  // 加好友。冷流量入口一律用這一條——只有加好友會觸發歡迎訊息。
  // 後面不可以接任何文字或參數。
  LINE_ADD_URL: 'https://lin.ee/STdLXx4',

  // 帶預填訊息。用 lineMessageUrl() 產生，不要自己串字串。
  LINE_OA_MESSAGE_BASE: 'https://line.me/R/oaMessage/%40709krpyl/?',

  // 平衡空間（NAS）官方 LINE @xyx9843q：銷售機器人、本月流月、365 都在這個帳號，/nas 底下的頁面一律連這裡。
  NAS_LINE_ADD_URL: 'https://line.me/R/ti/p/@xyx9843q',
};

/**
 * 依頁面路徑決定加好友連結：/nas 底下連平衡空間，其他連 Erick Firm。
 * @param {string} pathname
 * @returns {string}
 */
export const lineAddUrlFor = (pathname = '') =>
  /^\/nas(\/|$)/.test(pathname) ? LINE_CONFIG.NAS_LINE_ADD_URL : LINE_CONFIG.LINE_ADD_URL;

/**
 * 產生帶預填訊息的 LINE 連結。
 * @param {string} text 預填在對話框裡的文字，未編碼的原文即可
 * @returns {string}
 */
export const lineMessageUrl = (text) =>
  LINE_CONFIG.LINE_OA_MESSAGE_BASE + encodeURIComponent(text);
