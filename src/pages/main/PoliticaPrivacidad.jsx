import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar } from 'lucide-react';

const PoliticaPrivacidad = () => {
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
                Política de Privacidad
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Su privacidad y la seguridad de sus datos personales son nuestra máxima prioridad.
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
            <Shield className="text-formex-orange" size={24} />
            <h2 className="text-lg font-bold text-gray-900">Tratamiento y Protección de Datos Personales</h2>
          </div>

          <p>
            GLOBAL LEARNING SOLUTIONS EIRL se compromete con la protección, confidencialidad y seguridad de los datos personales de sus usuarios de la plataforma virtual FORMEX.
          </p>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">1. MARCO NORMATIVO Y CONSENTIMIENTO</h3>
            <p>
              Esta política se rige por la Ley N° 29733 (Ley de Protección de Datos Personales de Perú) y su Reglamento (D.S. N° 003-2013-JUS). Al registrarse o inscribirse, el usuario otorga su consentimiento libre, previo, expreso e inequívoco para el tratamiento de sus datos personales.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">2. RECOPILACIÓN DE INFORMACIÓN</h3>
            <div className="space-y-2 pl-4 border-l-2 border-formex-orange/30">
              <p>
                <strong>Directa:</strong> Nombre, correo electrónico, teléfono, país, contraseña, documentos de identidad (para emisión de certificados), perfil académico e interacciones de soporte.
              </p>
              <p>
                <strong>Indirecta:</strong> Dirección IP, tipo de navegador, sistema operativo, videos vistos, lecciones completadas, resultados de exámenes y tiempo de permanencia en la plataforma.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">3. DATOS FINANCIEROS</h3>
            <p>
              LA EMPRESA no almacena datos de tarjetas de crédito o débito. Los pagos se procesan de manera segura a través de pasarelas de pago asociadas (Niubiz, Izipay, Culqi, PayPal, Stripe) bajo sus propios estándares internacionales de seguridad PCI-DSS.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">4. FINALIDADES DEL TRATAMIENTO</h3>
            <p>
              Prestación del servicio educativo, facturación, mejora de la experiencia del aula virtual, seguridad y auditoría de accesos, comunicaciones comerciales y académicas, investigación estadística anónima y uso publicitario de logros de aprendizaje (salvo oposición expresa del usuario).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">5. TRANSFERENCIA TRANSFRONTERIZA</h3>
            <p>
              Los datos recopilados pueden ser procesados por proveedores de infraestructura tecnológica como AWS, Google Cloud o Microsoft Azure con servidores ubicados fuera del Perú, garantizando niveles de protección y seguridad de la información conforme a la Ley N° 29733.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">6. SEGURIDAD DE LA INFORMACIÓN</h3>
            <p>
              Implementamos protocolos seguros SSL/TLS, firewalls y medidas organizativas para proteger su información. Sin embargo, LA EMPRESA no se hace responsable de interceptaciones ilegales o intrusiones de terceros que escapen a su control técnico razonable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">7. DERECHOS ARCO (Acceso, Rectificación, Cancelación y Oposición)</h3>
            <p>
              Usted puede ejercer sus derechos ARCO enviando una solicitud formal al correo electrónico <strong>hola@formex.digital</strong>, adjuntando una copia legible de su documento de identidad y especificando de manera clara el derecho que desea ejercer.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">8. CONSERVACIÓN DE DATOS</h3>
            <p>
              Los datos se conservarán durante la relación contractual y el plazo de prescripción legal establecido. La eliminación de los datos implica la baja del aula virtual y la pérdida total del historial académico no descargado previamente.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">9. ACTUALIZACIÓN DE LA POLÍTICA</h3>
            <p>
              Cualquier cambio sustancial en la presente política será comunicado a través de LA PLATAFORMA o por correo electrónico. El uso continuado del servicio por parte del usuario implica la aceptación de los nuevos términos.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PoliticaPrivacidad;
