import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Calendar } from 'lucide-react';

const PoliticaCookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Enlace de regreso */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-formex-orange mb-8 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          <span>Volver a la página principal</span>
        </Link>

        {/* Encabezado */}
        <div className="bg-formex-dark text-white rounded-3xl p-8 md:p-12 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-formex-orange/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-formex-lime font-bold uppercase tracking-widest text-xs mb-2 block">
                GLOBAL LEARNING SOLUTIONS EIRL
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Política de Cookies
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Conozca cómo utilizamos las cookies y tecnologías similares para mejorar su experiencia de aprendizaje en FORMEX.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 self-start md:self-auto min-w-[200px]">
              <Calendar className="text-formex-lime shrink-0" size={24} />
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Última actualización</span>
                <span className="text-xs font-bold text-white uppercase">14 de mayo de 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-8 md:p-12 space-y-6 text-sm text-gray-600 leading-relaxed text-justify">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <ShieldCheck className="text-formex-orange" size={24} />
            <h2 className="text-lg font-bold text-gray-900">Uso de Cookies y Almacenamiento Local</h2>
          </div>

          <p>
            El presente documento regula el uso de dispositivos de almacenamiento y recuperación de datos ("Cookies") en el portal web FORMEX, propiedad de GLOBAL LEARNING SOLUTIONS EIRL, con RUC N° 20614113872.
          </p>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">1. DEFINICIÓN Y FUNCIÓN DE LAS COOKIES</h3>
            <p>
              Las cookies son archivos de datos que se descargan en el dispositivo del usuario al acceder a determinadas páginas web. Permiten almacenar información sobre hábitos de navegación, tiempo de conexión y preferencias de visualización.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">2. TIPOLOGÍA DE COOKIES UTILIZADAS</h3>
            <div className="space-y-2 pl-4 border-l-2 border-formex-orange/30">
              <p>
                <strong>A. Por entidad:</strong> Cookies Propias (del dominio de LA EMPRESA) y Cookies de Terceros (de servicios externos como analítica, pasarelas de pago y redes sociales).
              </p>
              <p>
                <strong>B. Por plazo:</strong> Cookies de Sesión (vigentes durante la sesión activa) y Cookies Persistentes (almacenadas durante un período definido).
              </p>
              <p>
                <strong>C. Por finalidad:</strong> Técnicas (esenciales para el funcionamiento), de Personalización, de Análisis y de Publicidad Comportamental.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">3. COOKIES DE TERCEROS</h3>
            <p>
              Se utilizan servicios de analítica web (ej. Google Analytics) y pasarelas de pago externas para garantizar la seguridad de las transacciones financieras.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">4. OTRAS TECNOLOGÍAS DE SEGUIMIENTO</h3>
            <p>
              Incluye herramientas de soporte en vivo, scripts de diagnóstico de rendimiento, píxeles de conversión publicitaria y cookies CDN para la distribución de video. Toda nueva tecnología se someterá a los estándares de la Ley N° 29733.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">5. GESTIÓN Y ELIMINACIÓN</h3>
            <p>
              El usuario puede configurar su navegador para bloquear o eliminar cookies. La desactivación de cookies técnicas puede impedir el acceso al aula virtual y afectar la emisión de certificados.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">6. CONSENTIMIENTO</h3>
            <p>
              Al navegar por FORMEX sin deshabilitar las cookies, el usuario manifiesta su consentimiento para el tratamiento de su información conforme a esta Política.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">7. ACTUALIZACIÓN</h3>
            <p>
              LA EMPRESA podrá modificar esta Política en función de nuevas exigencias de la Autoridad Nacional de Protección de Datos Personales o instrucciones de INDECOPI.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PoliticaCookies;
