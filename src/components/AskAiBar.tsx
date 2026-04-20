import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const quickPrompts = [
  'Me passa suas redes de contato.',
  'Qual stack voce usa hoje?',
  'Como voce trabalha em um novo projeto?',
];

const initialMessage: ChatMessage = {
  role: 'assistant',
  content:
    'Oi! Eu sou o assistente do Thiago. Pode me perguntar sobre stack, projetos e tambem pedir as redes de contato.',
};

export default function AskAiBar() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const parseApiPayload = async (response: Response) => {
    const rawText = await response.text();

    if (!rawText) return {} as Record<string, unknown>;

    try {
      return JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      const normalized = rawText.replace(/\s+/g, ' ').trim();

      if (
        response.status === 404 ||
        normalized.toLowerCase().includes('not found')
      ) {
        throw new Error(
          'Endpoint /api/chat nao encontrado. Se estiver local, rode `npm run dev`. No Vercel, confirme o deploy das funcoes em /api.',
        );
      }

      throw new Error('Resposta invalida da API de chat.');
    }
  };

  useEffect(() => {
    const element = logRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, isSending]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    const history = messages.slice(-8);
    const userMessage: ChatMessage = { role: 'user', content: message };

    setInputValue('');
    setErrorText('');
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      const payload = await parseApiPayload(response);

      if (!response.ok) {
        const apiError =
          typeof payload?.error === 'string'
            ? payload.error
            : 'Falha ao falar com a IA.';
        throw new Error(apiError);
      }

      const assistantText =
        typeof payload?.answer === 'string' && payload.answer.trim().length > 0
          ? payload.answer.trim()
          : 'Nao consegui montar uma resposta agora. Tente novamente em alguns segundos.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantText,
        },
      ]);
    } catch (error) {
      const fallbackMessage =
        'Nao consegui responder agora. Se preferir, fale comigo nas redes: LinkedIn https://linkedin.com/in/thiago-ventura-velez/ | Instagram https://instagram.com/th.dev1/ | GitHub https://github.com/thiagoventurav | YouTube https://www.youtube.com/@ThVenturaDev';
      const friendlyError =
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao consultar a IA.';

      setErrorText(friendlyError);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackMessage,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(inputValue);
  };

  return (
    <div
      className="ask-ai-shell"
      aria-label="Assistente virtual do Thiago Ventura"
    >
      <div className="ask-ai-header">
        <span className="ask-ai-badge">Th.dev</span>
        <p>Converse "comigo" sobre carreira, stack e contato.</p>
      </div>

      <div className="ask-ai-log" ref={logRef}>
        {messages.slice(-6).map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`ask-ai-row ${message.role}`}
          >
            <div className="ask-ai-bubble">{message.content}</div>
          </div>
        ))}

        {isSending && (
          <div className="ask-ai-row assistant">
            <div className="ask-ai-bubble">Pensando...</div>
          </div>
        )}
      </div>

      {errorText && <p className="ask-ai-error">{errorText}</p>}

      <div className="ask-ai-quick-list">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="ask-ai-quick-btn"
            onClick={() => {
              void sendMessage(prompt);
            }}
            disabled={isSending}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="ask-ai-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Pergunte qualquer coisa..."
          className="ask-ai-input"
          disabled={isSending}
          maxLength={500}
        />
        <button
          type="submit"
          className="ask-ai-submit"
          disabled={isSending || inputValue.trim().length === 0}
        >
          {isSending ? 'Enviando...' : 'Perguntar'}
        </button>
      </form>
    </div>
  );
}
