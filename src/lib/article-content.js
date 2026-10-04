const ENDING_PUNCTUATION = /[，。！？；：、]$/u;
const LIST_PREFIX = /^(?:[-*•·▪◦‣]|\d+[.)、]|[一二三四五六七八九十]+[、.])/u;

export function getBlockText(block = {}) {
  const richText = block?.[block?.type]?.rich_text;
  if (Array.isArray(richText)) return richText.map((part) => part?.plain_text || '').join('');
  return block.text ?? block.content ?? block.plain_text ?? '';
}

export function isArticleHeading(text, title = '') {
  const line = String(text || '').trim();
  const length = [...line].length;
  if (length < 4 || length > 28) return false;
  if (line === String(title || '').trim()) return false;
  if (line.startsWith('#') || /^(?:Q|A)\s*[:：]/i.test(line)) return false;
  if (LIST_PREFIX.test(line) || line.startsWith('← 返回洞察')) return false;
  return !ENDING_PUNCTUATION.test(line);
}

export function getArticleBlocks(blocks = [], title = '') {
  if (!Array.isArray(blocks)) return [];
  const result = [];
  blocks.forEach((block, blockIndex) => {
    const type = String(block?.type || 'paragraph').toLowerCase();
    const text = getBlockText(block);
    if (type === 'image') {
      result.push({ type, text: '', source: block, key: block.id || blockIndex });
      return;
    }
    if (!text) return;

    if (type === 'paragraph' || type === 'p') {
      String(text).split(/\r?\n/).forEach((rawLine, lineIndex) => {
        const line = rawLine.trim();
        if (!line) return;
        const explicitH2 = line.match(/^##\s+(.+)$/u);
        if (explicitH2 && explicitH2[1].trim() !== String(title || '').trim()) {
          result.push({ type: 'heading_2', text: explicitH2[1].trim(), source: block, key: `${block.id || blockIndex}-${lineIndex}` });
        } else if (isArticleHeading(line, title)) {
          result.push({ type: 'heading_2', text: line, source: block, key: `${block.id || blockIndex}-${lineIndex}` });
        } else {
          result.push({ type: 'paragraph', text: line, source: block, key: `${block.id || blockIndex}-${lineIndex}` });
        }
      });
      return;
    }

    const normalizedType = type === 'heading_1' || type === 'h1' ? 'heading_2'
      : type === 'h2' ? 'heading_2'
        : type === 'h3' ? 'heading_3'
          : type;
    result.push({ type: normalizedType, text: String(text), source: block, key: block.id || blockIndex });
  });
  return result;
}

function plainText(markdown) {
  return String(markdown || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*(?:[-*•·]|\d+[.)、])\s*/gm, '')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseArticleFaq(raw = '') {
  const pairs = [];
  let question = '';
  let answerLines = [];
  let inAnswer = false;

  const save = () => {
    const answer = plainText(answerLines.join(' '));
    if (question && answer) pairs.push([plainText(question), answer]);
    question = '';
    answerLines = [];
    inAnswer = false;
  };

  for (const rawLine of String(raw || '').split(/\r?\n/)) {
    const line = rawLine.trim()
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .replace(/\*\*\s+/g, ' ');
    const questionMatch = line.match(/^\s*#{0,6}\s*Q\s*\d*\s*[:：]\s*(.+)$/i);
    const answerMatch = line.match(/^\s*A\s*\d*\s*[:：]\s*(.*)$/i);
    if (questionMatch) {
      save();
      question = questionMatch[1].trim();
    } else if (answerMatch && question) {
      inAnswer = true;
      answerLines.push(answerMatch[1].trim());
    } else if (inAnswer && line && !/^[-*_]{3,}$/.test(line)) {
      answerLines.push(line);
    }
  }
  save();
  return pairs;
}

export function getArticleDescription(blocks = [], title = '') {
  const paragraphs = (blocks || [])
    .filter((block) => ['paragraph', 'p'].includes(String(block?.type || '').toLowerCase()))
    .map(getBlockText)
    .map(plainText)
    .filter((text) => text && text !== String(title || '').trim());
  if (!paragraphs.length) return '';
  const openingText = paragraphs.join(' ');
  const sentences = openingText.match(/[^。！？]+[。！？]|[^。！？]+$/gu) || [openingText];
  let description = '';
  for (const sentence of sentences) {
    const next = `${description}${sentence.trim()}`;
    if (description && [...next].length > 120) break;
    description = next;
    if ([...description].length >= 90) break;
  }
  return description.trim();
}

export function getFaqSource(post = {}, faqBlocks = []) {
  const source = post.aeoFaq || post.aeo_faq;
  if (source) return source;
  return (faqBlocks || []).map(getBlockText).join('\n');
}
