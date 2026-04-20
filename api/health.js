import { getHealthPayload } from '../server/chatService.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Metodo nao permitido.' });
  }

  return res.status(200).json(getHealthPayload());
}
