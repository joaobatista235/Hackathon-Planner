import { useEffect, useState } from "react";
import { useAuth } from "@/application/context/AuthContext";
import { Icon } from "@/presentation/components/base/Icon/Icon";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ==========================================================
// ASSUNÇÃO: endpoint de exclusão
// DELETE http://localhost:3000/api/ai-history/<id>
// Ajuste a URL abaixo se a rota real for diferente.
// ==========================================================

interface AiHistory {
  id: number;
  userId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export function AiPageHistory() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<AiHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    loadHistory();
  }, [user]);

  async function loadHistory() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/ai-history/user/${user?.id}`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: AiHistory[] = await response.json();

      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta mensagem?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `http://localhost:3000/api/ai-history/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setMessages((prev) => prev.filter((message) => message.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir a mensagem.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR");
  }

  return (
    <div className="ai-page">

      <div className="page-header">
        <div className="page-header__left">
          <h1>Histórico da IA</h1>
          <p>Todas as mensagens enviadas ao assistente.</p>
        </div>

        <button onClick={loadHistory}>
          <Icon name={"refresh" as any} size={18} />
          Atualizar
        </button>
      </div>

      <div className="page-content">

        {loading && (
          <p>Carregando...</p>
        )}

        {!loading && messages.length === 0 && (
          <p>Nenhuma conversa encontrada.</p>
        )}

        {!loading && messages.map(message => (

          <div
            key={message.id}
            className={
              message.role === "USER"
                ? "chat-message chat-message--user"
                : "chat-message chat-message--assistant"
            }
          >

            <div className="chat-message__header">

              <strong>
                {message.role === "USER"
                  ? "Você"
                  : "Assistente IA"}
                    <br/>
              </strong>
  <br/>
              <span>
                {formatDate(message.createdAt)}
              </span>

              <button
                className="chat-message__delete"
                onClick={() => handleDelete(message.id)}
                disabled={deletingId === message.id}
                title="Excluir mensagem"
              >
                <Icon name={"trash" as any} size={16} />
              </button>

            </div>

            <div className="chat-message__content">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {message.content}

  </ReactMarkdown>

                    <br/>
</div>

          </div>

        ))}

      </div>

    </div>
  );
}
