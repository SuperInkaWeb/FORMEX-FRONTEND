// src/services/ForumService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api"; 
// 👆 Ajusta la URL según tu backend (puerto y prefijo)

const ForumService = {
  // Obtener mensajes de un recurso
  async getMessages(courseId, resourceId) {
    const res = await axios.get(
      `${API_URL}/courses/${courseId}/resources/${resourceId}/forum`
    );
    return res.data;
  },

  // Crear un nuevo mensaje
  async createMessage(courseId, resourceId, author, content) {
    const res = await axios.post(
      `${API_URL}/courses/${courseId}/resources/${resourceId}/forum`,
      { author, content }
    );
    return res.data;
  },

  // Eliminar un mensaje (solo instructor/admin)
  async deleteMessage(courseId, resourceId, messageId) {
    await axios.delete(
      `${API_URL}/courses/${courseId}/resources/${resourceId}/forum/${messageId}`
    );
  },
};

export default ForumService;
