// src/services/certificateService.js
import api from './api';

const CertificateService = {
  generateCertificate: async (payload) => {
    const response = await api.post('/api/certificates/generate', payload, {
      responseType: 'blob' // 👈 importante para recibir PDF
    });
    return response;
  }
};

export default CertificateService;
