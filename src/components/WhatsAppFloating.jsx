import React from 'react';
import whatsappIcon from '../assets/whatsapp-logo-messenger-icon-realistic-social-media-logotype-whats-app-button-transparent-background-272905344.webp';

const WhatsAppFloating = () => {
  const whatsappUrl = "https://wa.me/972594948"; // Número extraído del footer original

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Hablar por WhatsApp"
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100">
        ¿En qué podemos ayudarte? 👋
      </div>

      {/* Efecto de pulso */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>

      {/* Botón con imagen circular */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xl rounded-full overflow-hidden bg-white border border-gray-100">
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="w-full h-full object-cover transform scale-110"
        />
      </div>
    </a>
  );
};

export default WhatsAppFloating;
