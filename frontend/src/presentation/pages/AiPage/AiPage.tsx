import { useState } from 'react';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import { useAuth } from '@/application/context/AuthContext';
import { AiPageHistory } from '../AiPageHistory/AiPageHistory';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // supõe que useAuth retorna { user: { id, ... } }

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou seu assistente de planejamento educacional. Posso ajudar a criar aulas, avaliações e organizar seu semestre.',
    },
  ]);

  async function sendMessage() {
    if (!message.trim()) return;

    if (!user?.id) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Não foi possível identificar o usuário. Faça login novamente.',
        },
      ]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3000/api/aigroq/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            userId: user.id, // ID do usuário enviado ao backend
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.message ??
            data.response ??
            'Não consegui gerar uma resposta.',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Erro ao conectar com o assistente de IA.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-page">
      <div className="page-header">
        <div className="page-header__left">
          <h1>Assistente IA</h1>
          <p>Planeje aulas, avaliações e atividades com inteligência artificial.</p>
        </div>
      </div>

      <div className="page-content">
        <section className="ai-card">
          <div className="ai-chat">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === 'user'
                    ? 'chat-message chat-message--user'
                    : 'chat-message chat-message--assistant'
                }
              >
                <div className="chat-message__content">{msg.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message__icon"></div>
                <div className="chat-message__content">Pensando...</div>
              </div>
            )}
          </div>

          <div className="ai-input">
            <textarea
              value={message}
              placeholder="Digite sua pergunta para a IA..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage} disabled={loading}>
              <Icon name={'send' as any} size={18} />
              Enviar
            </button>
          </div>

          <div>
            <AiPageHistory></AiPageHistory>
          </div>
        </section>
      </div>
    </div>
  );
}