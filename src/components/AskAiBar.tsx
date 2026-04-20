import { useEffect, useRef, useState } from 'react';
import type { FormEvent, WheelEvent } from 'react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface NativeSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

const quickPrompts = [
  'Me passa suas redes de contato.',
  'Qual stack voce usa hoje?',
  'Como voce trabalha em um novo projeto?',
];

export default function AskAiBar() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<NativeSpeechRecognition | null>(null);

  const activateConversationMode = () => {
    setIsExpanded(true);
  };

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

  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('chat-focus-active');
    } else {
      document.body.classList.remove('chat-focus-active');
    }

    return () => {
      document.body.classList.remove('chat-focus-active');
    };
  }, [isExpanded]);

  useEffect(() => {
    const nativeWindow = window as Window & {
      SpeechRecognition?: new () => NativeSpeechRecognition;
      webkitSpeechRecognition?: new () => NativeSpeechRecognition;
    };

    const RecognitionCtor =
      nativeWindow.SpeechRecognition || nativeWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) return;

    const recognition = new RecognitionCtor();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let index = event.results.length - 1; index >= 0; index -= 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript || '';

        if (!transcript) continue;

        if (result.isFinal) {
          finalTranscript = transcript;
          break;
        }

        if (!finalTranscript) {
          finalTranscript = transcript;
        }
      }

      if (finalTranscript) {
        setInputValue(finalTranscript.trim());
        activateConversationMode();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setErrorText(
        event.error === 'not-allowed'
          ? 'Microfone bloqueado. Libere a permissao do navegador para usar a voz.'
          : 'Nao foi possivel usar o microfone neste navegador.',
      );
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const handleShellWheel = (event: WheelEvent<HTMLDivElement>) => {
    const logElement = logRef.current;

    // Keep wheel interaction inside chat to avoid page-level smooth scroll.
    event.stopPropagation();

    if (!logElement) {
      event.preventDefault();
      return;
    }

    const targetNode = event.target as Node | null;
    const insideLog = Boolean(targetNode) && logElement.contains(targetNode);

    if (!insideLog) {
      event.preventDefault();
      return;
    }

    const canScrollLog = logElement.scrollHeight > logElement.clientHeight;

    if (!canScrollLog) {
      event.preventDefault();
      return;
    }

    const atTop = logElement.scrollTop <= 0;
    const atBottom =
      logElement.scrollTop + logElement.clientHeight >=
      logElement.scrollHeight - 1;
    const scrollingUp = event.deltaY < 0;
    const scrollingDown = event.deltaY > 0;

    event.preventDefault();

    if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
      return;
    }

    logElement.scrollTop += event.deltaY;
  };

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    activateConversationMode();

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

  const toggleMic = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setErrorText(
        'Seu navegador nao suporta microfone nativo via Speech Recognition.',
      );
      return;
    }

    setErrorText('');
    activateConversationMode();

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setErrorText(
        'Nao foi possivel iniciar o microfone agora. Tente novamente.',
      );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(inputValue);
  };

  return (
    <div
      className={`ask-ai-shell${isExpanded ? ' ask-ai-shell-expanded' : ''}`}
      aria-label="Assistente virtual do Thiago Ventura"
      aria-expanded={isExpanded}
      onWheel={handleShellWheel}
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
              activateConversationMode();
              void sendMessage(prompt);
            }}
            disabled={isSending}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="ask-ai-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className={`ask-ai-mic-btn${isListening ? ' is-listening' : ''}`}
          onClick={toggleMic}
          aria-label={isListening ? 'Parar microfone' : 'Ativar microfone'}
          aria-pressed={isListening}
          title={
            isListening
              ? 'Parar ditado por voz'
              : 'Ditado por voz com o microfone'
          }
          disabled={isSending}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H9v2h6v-2h-2v-3.08A7 7 0 0 0 19 11h-2Z" />
          </svg>
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={activateConversationMode}
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
