import Groq from 'groq-sdk';
import { formatContext, retrieveContext } from './rag/retriever.js';

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_TOP_K = 4;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 8;

export class ChatServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ChatServiceError';
    this.statusCode = statusCode;
  }
}

export function getGroqModel() {
  return process.env.GROQ_MODEL || DEFAULT_MODEL;
}

export function getHealthPayload() {
  return {
    ok: true,
    model: getGroqModel(),
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
  };
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string',
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function buildSystemPrompt(ragContext) {
  return [
    'Voce e o assistente de portfolio do Thiago Ventura.',
    'Responda sempre em portugues do Brasil.',
    'Quando estiver falando da carreira, habilidades ou experiencia dele, escreva em primeira pessoa.',
    'Se a pergunta pedir redes sociais, contato, contratacao ou parceria, entregue os links de contato completos presentes no contexto.',
    'Nao invente fatos. Se faltarem dados, diga isso claramente e convide o visitante para falar pelos canais de contato.',
    'Mantenha respostas objetivas, naturais e com tom profissional amigavel.',
    'Contexto RAG relevante para esta pergunta:',
    ragContext,
  ].join('\n');
}

function sanitizeMessage(rawMessage) {
  return (typeof rawMessage === 'string' ? rawMessage : '')
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
}

function getTopK() {
  const parsed = Number(process.env.RAG_TOP_K || DEFAULT_TOP_K);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_TOP_K;
  return Math.min(Math.floor(parsed), 8);
}

function normalizePayload(payload) {
  if (!payload) return {};
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }
  if (typeof payload === 'object') return payload;
  return {};
}

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function generateChatResponse(rawPayload) {
  const payload = normalizePayload(rawPayload);
  const message = sanitizeMessage(payload.message);

  if (!message) {
    throw new ChatServiceError(400, 'A mensagem nao pode estar vazia.');
  }

  const groqClient = getGroqClient();
  if (!groqClient) {
    throw new ChatServiceError(
      500,
      'GROQ_API_KEY nao configurada no servidor.',
    );
  }

  try {
    const history = sanitizeHistory(payload.history);
    const contextChunks = retrieveContext(message, { limit: getTopK() });
    const ragContext = formatContext(contextChunks);

    const completion = await groqClient.chat.completions.create({
      model: getGroqModel(),
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(ragContext),
        },
        ...history,
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      throw new ChatServiceError(502, 'A IA nao retornou texto na resposta.');
    }

    return {
      answer,
      model: getGroqModel(),
      contextIds: contextChunks.map((chunk) => chunk.id),
    };
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }

    const messageText =
      error instanceof Error ? error.message : 'Erro desconhecido';
    throw new ChatServiceError(500, `Falha ao gerar resposta: ${messageText}`);
  }
}
