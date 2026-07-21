import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import { useAuth } from '@/application/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AiChatWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  role: 'assistant',
  content:
    'Olá! Sou seu assistente de planejamento educacional. Posso ajudar a criar aulas, avaliações e organizar seu semestre. Como posso ajudar?',
};

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history from backend
  useEffect(() => {
    if (!user?.id || !open) return;
    
    async function fetchHistory() {
      try {
        const res = await fetch(`http://localhost:3000/api/ai-history/user/${user?.id}`);
        if (res.ok) {
          const data: any[] = await res.json();
          if (data.length > 0) {
            const mapped = data.map(msg => ({
              role: msg.role === 'USER' ? 'user' : 'assistant',
              content: msg.content
            }));
            setMessages(mapped as Message[]);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading chat history", err);
      }
      // If no history or error, keep welcome message
      if (messages.length === 0) setMessages([WELCOME]);
    }

    // Only load if we haven't loaded yet (length is 1 meaning just welcome)
    if (messages.length <= 1) {
      fetchHistory();
    }
  }, [user?.id, open]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Auto-focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId: user?.id }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message ?? data.response ?? 'Não consegui gerar uma resposta.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Erro ao conectar com o assistente. Tente novamente.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div className={`ai-widget ${open ? 'ai-widget--open' : ''}`} role="dialog" aria-label="Assistente IA">
        {/* Header */}
        <div className="ai-widget__header">
          <div className="ai-widget__header-info">
            <div className="ai-widget__avatar">
              <Icon name="bot" size={16} />
            </div>
            <div>
              <p className="ai-widget__name">Assistente IA</p>
              <span className="ai-widget__status">Planejamento educacional</span>
            </div>
          </div>
          <button className="icon-btn" onClick={() => setOpen(false)} title="Fechar" aria-label="Fechar chat">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-widget__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="ai-msg__avatar">
                  <Icon name="bot" size={12} />
                </div>
              )}
              <div className="ai-msg__bubble">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-msg ai-msg--assistant">
              <div className="ai-msg__avatar">
                <Icon name="bot" size={12} />
              </div>
              <div className="ai-msg__bubble ai-msg__bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="ai-widget__input">
          <textarea
            ref={textareaRef}
            className="ai-widget__textarea"
            rows={1}
            placeholder="Mensagem… (Enter para enviar)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="ai-widget__send"
            onClick={send}
            disabled={loading || !input.trim()}
            title="Enviar"
            aria-label="Enviar mensagem"
          >
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>

      {/* FAB trigger */}
      <button
        className={`ai-fab ${open ? 'ai-fab--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        title="Assistente IA"
        aria-label="Abrir assistente de IA"
      >
        <Icon name={open ? 'x' : 'bot'} size={22} />
      </button>
    </>
  );
}
