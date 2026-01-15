// src/pages/instructor/ResourceForum.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import ForumService from "../../services/ForumService";
import { useAuth0 } from "@auth0/auth0-react";

const ResourceForum = () => {
  const { courseId, resourceId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
const { user } = useAuth0();

const authorName =
  user?.name ||
  user?.given_name ||
  user?.nickname ||
  user?.email ||
  "Usuario";

  // 🔹 Cargar mensajes desde el backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await ForumService.getMessages(courseId, resourceId);
        setMessages(data);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      }
    };
    fetchMessages();
  }, [courseId, resourceId]);

  // 🔹 Enviar mensaje al backend
  const handleSend = async (e) => {
  e.preventDefault();
  if (!text.trim() || !user) return;

  try {
    const newMessage = await ForumService.createMessage(
      courseId,
      resourceId,
      `${authorName} (Instructor)`,
      text
    );
    setMessages((prev) => [...prev, newMessage]);
    setText("");
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
};

  // 🔹 Eliminar mensaje en el backend
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este mensaje?")) {
      try {
        await ForumService.deleteMessage(courseId, resourceId, id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Error eliminando mensaje:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            to={`/instructor/course/${courseId}/resources`}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ← Volver a recursos
          </Link>
          <h1 className="text-xl font-bold">Foro del recurso</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Mensajes</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500">Aún no hay mensajes.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="border rounded p-3 flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{m.author}</p>
                    <p>{m.content}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Nuevo mensaje</h2>
          <form onSubmit={handleSend} className="space-y-3">
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Escribe tu comentario..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Publicar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ResourceForum;
