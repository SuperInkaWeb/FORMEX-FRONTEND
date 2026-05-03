import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';


const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false); // ✅ FALTABA

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.warning('Completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      toast.success('Mensaje enviado correctamente');

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      console.error(error);
      toast.error('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
     

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">

        {/* Información de Contacto */}
        <div>
          <span className="text-formex-orange font-bold uppercase tracking-widest text-sm mb-2 block">
            Soporte Técnico
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Estamos aquí para ayudarte
          </h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            ¿Tienes problemas con la plataforma o dudas sobre tu matrícula?
            Nuestro equipo de soporte está listo para resolver tus inquietudes.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-formex-orange">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Correo Electrónico</h3>
                <p className="text-gray-500">hola@formex.digital</p>
                <p className="text-xs text-gray-400 mt-1">Respuesta en aprox. 24 horas</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-lime-50 rounded-full flex items-center justify-center text-lime-700">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Teléfono / WhatsApp</h3>
                <p className="text-gray-500">+51 972594948</p>
                <p className="text-xs text-gray-400 mt-1">Lunes a Viernes, 9am - 6pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-700">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Oficina Principal</h3>
                <p className="text-gray-500">Lima, Perú</p>
                <p className="text-xs text-gray-400 mt-1">Centro Empresarial Real</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Correo de Contacto</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                placeholder="juan@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Asunto</label>
              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all bg-white"
              >
                <option value="">Seleccione un asunto</option>
                <option value="Consulta General">Consulta General</option>
                <option value="Soporte Técnico">Soporte Técnico</option>
                <option value="Facturación">Facturación / Pagos</option>
                <option value="Empresas">Información para Empresas</option>
              </select>
            </div>

            {/* 👇 ESTA PARTE NO SE TOCÓ */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
              <textarea
                rows="4"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all resize-none"
                placeholder="¿En qué podemos ayudarte hoy?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-formex-dark text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Support;
