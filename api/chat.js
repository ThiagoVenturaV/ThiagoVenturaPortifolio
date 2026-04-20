import {
  ChatServiceError,
  generateChatResponse,
} from '../server/chatService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo nao permitido.' });
  }

  try {
    const payload = await generateChatResponse(req.body);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof ChatServiceError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    const message = error instanceof Error ? error.message : 'Erro inesperado.';
    return res.status(500).json({ error: message });
  }
}
