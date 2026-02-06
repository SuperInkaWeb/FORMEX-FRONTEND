// src/services/ForumService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"; 
// 👆 Usa VITE_API_URL en producción, localhost como fallback

const ForumService = {
  // Obtener mensajes de un recurso
  async getMessages(courseId, resourceId) {
    const res = await axios.get(
      `${API_URL}/api/courses/${courseId}/resources/${resourceId}/forum`
    );
    return res.data;
  },

  // Crear un nuevo mensaje
  async createMessage(courseId, resourceId, author, content) {
    const res = await axios.post(
      `${API_URL}/api/courses/${courseId}/resources/${resourceId}/forum`,
      { author, content }
    );
    return res.data;
  },

  // Eliminar un mensaje (solo instructor/admin)
  async deleteMessage(courseId, resourceId, messageId) {
    await axios.delete(
      `${API_URL}/api/courses/${courseId}/resources/${resourceId}/forum/${messageId}`
    );
  },
};

export default ForumService;
