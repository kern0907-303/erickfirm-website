// 不支援 text-wrap: pretty 的瀏覽器（較舊的 iPhone Safari、Firefox）用這段補上：
// 在每段文字最後兩個中文字之間放入不可見的連接符，讓最後一行至少保留兩個字。
const CJK = '\\u3400-\\u9FFF\\uF900-\\uFAFF';
const TAIL = new RegExp('([' + CJK + 'A-Za-z0-9])([' + CJK + '][\\u3000-\\u303F\\uFF00-\\uFFEF」』）)!?.,]*\\s*)$');
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT']);

const fixNode = (node) => {
  const parent = node.parentElement;
  if (!parent || SKIP.has(parent.tagName) || parent.isContentEditable) return;
  const text = node.nodeValue;
  if (!text || text.length < 3) return;
  const next = text.replace(TAIL, '$1⁠$2');
  if (next !== text) node.nodeValue = next;
};

const fixTree = (root) => {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) { fixNode(root); return; }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) { fixNode(current); current = walker.nextNode(); }
};

export function startNoOrphans() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.CSS && CSS.supports && CSS.supports('text-wrap', 'pretty')) return;
  const pending = new Set();
  let scheduled = false;
  const flush = () => {
    scheduled = false;
    pending.forEach((node) => fixTree(node));
    pending.clear();
  };
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'characterData') pending.add(record.target);
      record.addedNodes.forEach((node) => pending.add(node));
    });
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(flush); }
  });
  fixTree(document.body);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}
