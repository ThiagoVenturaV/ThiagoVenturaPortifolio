import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { formatContext, retrieveContext } from './rag/retriever.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 8;

const groqApiKey = process.env.GROQ_API_KEY;
const groqClient = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_, res) => {
  res.json({
    ok: true,
    model: GROQ_MODEL,
    groqConfigured: Boolean(groqApiKey),
  });
});

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

app.post('/api/chat', async (req, res) => {
  try {
    if (!groqClient) {
      return res.status(500).json({
        error: 'GROQ_API_KEY nao configurada no servidor.',
      });
    }

    const rawMessage =
      typeof req.body?.message === 'string' ? req.body.message : '';
    const message = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);

    if (!message) {
      return res.status(400).json({
        error: 'A mensagem nao pode estar vazia.',
      });
    }

    const history = sanitizeHistory(req.body?.history);
    const contextChunks = retrieveContext(message, {
      limit: Number(process.env.RAG_TOP_K || 4),
    });
    const ragContext = formatContext(contextChunks);

    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
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
      return res.status(502).json({
        error: 'A IA nao retornou texto na resposta.',
      });
    }

    return res.json({
      answer,
      model: GROQ_MODEL,
      contextIds: contextChunks.map((chunk) => chunk.id),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    return res.status(500).json({
      error: `Falha ao gerar resposta: ${message}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`[AI API] running on http://localhost:${PORT}`);
  console.log(`[AI API] model: ${GROQ_MODEL}`);
});
