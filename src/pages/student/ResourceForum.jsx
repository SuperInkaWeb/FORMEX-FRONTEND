import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send, User, Loader } from "lucide-react";
import ForumService from "../../services/ForumService";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'sonner';

const ResourceForum = () => {
  const { courseId, resourceId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, getAccessTokenSilently } = useAuth0(); 

  const authorName =
    user?.name ||
    user?.given_name ||
    user?.nickname ||
    user?.email ||
    "Usuario";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const data = await ForumService.getMessages(courseId, resourceId, token);
        setMessages(data || []);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [courseId, resourceId, getAccessTokenSilently]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const newMessage = await ForumService.createMessage(
        courseId,
        resourceId,
        `${authorName} (Estudiante)`,
        text,
        token
      );

      setMessages((prev) => [...prev, newMessage]);
      setText("");
      toast.success('Mensaje publicado');
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      toast.error('Error al enviar mensaje');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-formex-orange" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/student/course/${courseId}/resources`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Recursos</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Foro de consultas</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* Lista de Mensajes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-formex-orange" />
            <h2 className="text-lg font-extrabold text-gray-900">Conversación</h2>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
              <p className="text-gray-400 text-sm">Aún no hay mensajes. ¡Sé el primero en preguntar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const isInstructor = m.author?.toLowerCase().includes('instructor');
                const isMe = m.author?.includes(authorName);

                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${isInstructor ? 'bg-orange-100 text-formex-orange' : isMe ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                      {m.author?.charAt(0) || 'U'}
                    </div>

                    {/* Bubble */}
                    <div className={`relative max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                      isMe 
                        ? 'bg-purple-50 border-purple-100 rounded-tr-none' 
                        : isInstructor
                          ? 'bg-orange-50 border-orange-100 rounded-tl-none'
                          : 'bg-white border-gray-100 rounded-tl-none'
                    }`}>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isInstructor ? 'text-orange-600' : isMe ? 'text-purple-600' : 'text-gray-400'}`}>
                          {m.author}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Formulario de Mensaje */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xl p-4 sticky bottom-8 border-t-4 border-t-formex-orange">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-sm text-purple-600">
                {authorName.charAt(0)}
              </div>
              <textarea
                className="flex-1 w-full border-none bg-gray-50 p-3 rounded-xl text-sm focus:ring-0 outline-none resize-none placeholder:text-gray-400 font-medium"
                rows={2}
                placeholder="Escribe tu duda o comentario aquí..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-2 bg-formex-orange text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={14} /> Publicar comentario
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ResourceForum;
