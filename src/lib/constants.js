// 全站核心配置與私域引流參數
export const LINE_CONFIG = {
  // 官方帳號基本 ID。舊的 U4744aca... 已失效，不要再使用。
  LINE_BASIC_ID: '@709krpyl',

  // 加好友。冷流量入口一律用這一條——只有加好友會觸發歡迎訊息。
  // 後面不可以接任何文字或參數。
  LINE_ADD_URL: 'https://lin.ee/STdLXx4',

  // 帶預填訊息。用 lineMessageUrl() 產生，不要自己串字串。
  LINE_OA_MESSAGE_BASE: 'https://line.me/R/oaMessage/%40709krpyl/?',
};

/**
 * 產生帶預填訊息的 LINE 連結。
 * @param {string} text 預填在對話框裡的文字，未編碼的原文即可
 * @returns {string}
 */
export const lineMessageUrl = (text) =>
  LINE_CONFIG.LINE_OA_MESSAGE_BASE + encodeURIComponent(text);
