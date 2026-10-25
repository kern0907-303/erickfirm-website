import { DAILY_RELATION_COPY } from '../../content/nasLifeNumberCopy.js';

const CONFLICT_PAIRS = [[1, 5], [5, 1], [2, 7], [7, 2], [3, 8], [8, 3], [4, 9], [9, 4]];

function lastDigit(path) {
  if (!path) return null;
  const parts = String(path).replace(/^[+-]/, '').split('/').filter(Boolean);
  if (!parts.length || parts.some((part) => part.includes('?'))) return null;
  const number = Number.parseInt(parts.at(-1).replace(/\D/g, ''), 10);
  return number >= 1 && number <= 9 ? number : null;
}

export function relationForPaths(mainPath, flowPath) {
  const main = lastDigit(mainPath);
  const flow = lastDigit(flowPath);
  if (main === null || flow === null) return null;
  if (flow === main) return 'resonance';
  if (Math.abs(flow - main) === 1 || (main === 1 && flow === 9) || (main === 9 && flow === 1)) return 'flow';
  if (flow + main === 10) return 'help';
  if (CONFLICT_PAIRS.some(([left, right]) => left === main && right === flow)) return 'clash';
  const difference = Math.abs(flow - main);
  if (difference >= 4 && difference <= 5) return 'trial';
  return 'calm';
}

export function dailyGuidanceForPaths(mainPath, flowPath) {
  const relation = relationForPaths(mainPath, flowPath);
  return relation ? { relation, text: DAILY_RELATION_COPY[relation] } : null;
}
