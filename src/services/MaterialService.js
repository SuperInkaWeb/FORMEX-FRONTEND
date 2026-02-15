import api from './api';

const MaterialService = {

  getMaterials: async (sessionId) => {
    const { data } = await api.get(
      `/api/sessions/${sessionId}/materials`
    );
    return data;
  },

  createMaterial: async (sessionId, material) => {
    const { data } = await api.post(
      `/api/sessions/${sessionId}/materials`,
      material
    );
    return data;
  },

  deleteMaterial: async (sessionId, materialId) => {
    await api.delete(
      `/api/sessions/${sessionId}/materials/${materialId}`
    );
  }

};

export default MaterialService;
