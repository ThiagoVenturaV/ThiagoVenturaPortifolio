import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  ChatServiceError,
  generateChatResponse,
  getHealthPayload,
} from './chatService.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_, res) => {
  res.json(getHealthPayload());
});

app.post('/api/chat', async (req, res) => {
  try {
    const payload = await generateChatResponse(req.body);
    return res.json(payload);
  } catch (error) {
    if (error instanceof ChatServiceError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    const message = error instanceof Error ? error.message : 'Erro inesperado.';
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`[AI API] running on http://localhost:${PORT}`);
  console.log(`[AI API] model: ${getHealthPayload().model}`);
});
