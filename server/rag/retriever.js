import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knowledgePath = path.resolve(__dirname, '../data/knowledge-base.json');

const knowledgeRaw = fs.readFileSync(knowledgePath, 'utf-8');
const knowledge = JSON.parse(knowledgeRaw);
const chunks = Array.isArray(knowledge.chunks) ? knowledge.chunks : [];

const stopWords = new Set([
  'que',
  'com',
  'para',
  'uma',
  'das',
  'dos',
  'por',
  'como',
  'sobre',
  'isso',
  'essa',
  'esse',
  'seu',
  'sua',
  'meu',
  'minha',
  'vou',
  'quer',
  'quero',
  'pode',
]);

const contactTokens = new Set([
  'contato',
  'contatos',
  'rede',
  'redes',
  'social',
  'sociais',
  'linkedin',
  'instagram',
  'github',
  'youtube',
  'email',
  'falar',
  'conversar',
  'chamar',
  'contratar',
]);

function normalize(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9@:/._\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value = '') {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function scoreChunk(queryTokens, normalizedQuery, chunk) {
  const title = normalize(chunk.title);
  const content = normalize(chunk.content);
  const tags = (chunk.tags || []).map((tag) => normalize(tag));

  let score = chunk.id === 'identity' ? 2 : 0;

  for (const token of queryTokens) {
    if (title.includes(token)) score += 3;
    if (content.includes(token)) score += 1;
    if (tags.some((tag) => tag.includes(token))) score += 4;
  }

  if (normalizedQuery && content.includes(normalizedQuery)) {
    score += 8;
  }

  const asksForContact = queryTokens.some((token) => contactTokens.has(token));
  if (asksForContact && chunk.id === 'contacts') {
    score += 20;
  }

  return score;
}

export function retrieveContext(query, options = {}) {
  const limit = Number(options.limit || 4);
  const normalizedQuery = normalize(query);
  const queryTokens = tokenize(query);

  const ranked = chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(queryTokens, normalizedQuery, chunk),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .map((item) => item.chunk);

  const mandatory = chunks.filter((chunk) => chunk.id === 'identity');
  const combined = [...mandatory, ...ranked];

  const seen = new Set();
  const unique = [];
  for (const chunk of combined) {
    if (seen.has(chunk.id)) continue;
    seen.add(chunk.id);
    unique.push(chunk);
    if (unique.length >= limit) break;
  }

  return unique;
}

export function formatContext(contextChunks) {
  return contextChunks
    .map((chunk, index) => `[${index + 1}] ${chunk.title}\n${chunk.content}`)
    .join('\n\n');
}
