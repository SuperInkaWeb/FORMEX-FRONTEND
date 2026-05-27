import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

const TerminosCondiciones = () => {
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
                Términos y Condiciones
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Lea atentamente las condiciones que regulan el uso de nuestra plataforma y servicios de aprendizaje.
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
            <FileText className="text-formex-orange" size={24} />
            <h2 className="text-lg font-bold text-gray-900">Términos y Condiciones de Uso</h2>
          </div>

          <p>
            El sitio web y plataforma FORMEX es propiedad exclusiva de GLOBAL LEARNING SOLUTIONS EIRL, RUC N° 20614113872, domiciliada en Calle Ramón Zavala 790, La Perla, Callao. El simple uso de LA PLATAFORMA implica la aceptación plena de estos Términos. Conforme a la Ley N° 29733, el usuario otorga su consentimiento para que LA EMPRESA trate sus datos personales para fines académicos, de facturación y envío de información comercial. Puede ejercer sus derechos ARCO escribiendo a <strong>hola@formex.digital</strong>.
          </p>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">1. SERVICIO</h3>
            <p>
              LA PLATAFORMA ofrece acceso a contenidos educativos (texto, imagen, audio y video) mediante la compra de cursos específicos. Los precios son variables, sin afectar a quienes ya adquirieron el servicio previamente.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">2. NORMAS DE CONDUCTA</h3>
            <p>
              El usuario es responsable de su uso de LA PLATAFORMA. Está prohibido dañar o interferir con el sistema, obtener acceso no autorizado, compartir contraseñas, realizar descargas masivas, falsificar identidad o cometer fraude y plagio académico.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">3. CONDUCTAS PROHIBIDAS</h3>
            <p>
              Queda prohibido publicar contenido difamatorio, ilegal, obsceno, pornográfico, con virus o malware, publicidad comercial, contenido político partidista, información inexacta con intención de engañar o que infrinja derechos de autor de terceros.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">4. CUENTA DE USUARIO</h3>
            <p>
              El usuario debe proporcionar información exacta al registrarse, no compartir sus credenciales con terceros y mantener su perfil actualizado. Los perfiles con contenido prohibido serán eliminados de LA PLATAFORMA.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">5. PROPIEDAD INTELECTUAL</h3>
            <p>
              Todo el contenido de LA PLATAFORMA está protegido por derechos de autor de GLOBAL LEARNING SOLUTIONS EIRL o sus licenciadores. Queda prohibida la reproducción, distribución o comunicación pública sin autorización expresa.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">6. EXENCIÓN DE RESPONSABILIDAD</h3>
            <p>
              LA EMPRESA no garantiza resultados laborales específicos derivados del uso de los cursos. El éxito del aprendizaje depende del desempeño individual del estudiante.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">7. POLÍTICA DE REEMBOLSOS</h3>
            <p>
              Por la naturaleza digital del servicio, no se realizan reembolsos una vez efectuado el pago (venta final). La única excepción es el fraude comprobado por robo de tarjeta, que debe reportarse en un máximo de 48 horas adjuntando denuncia policial a <strong>hola@formex.digital</strong>. LA PLATAFORMA puede reprogramar fechas de cursos sin que esto constituya cancelación ni derecho a reembolso.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">8. LIBRO DE RECLAMACIONES</h3>
            <p>
              En cumplimiento del Código de Protección y Defensa del Consumidor, LA PLATAFORMA pone a disposición un{' '}
              <Link to="/libro-reclamaciones" className="text-formex-orange underline font-bold">Libro de Reclamaciones Virtual</Link>.
              Las quejas o reclamos serán atendidos en los plazos de ley.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">9. LEY APLICABLE Y JURISDICCIÓN</h3>
            <p>
              Estos términos se rigen por las leyes de la República del Perú. Para la resolución de controversias, las partes se someten a los Jueces y Tribunales del Distrito Judicial de Lima.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">10. MODIFICACIONES</h3>
            <p>
              LA EMPRESA se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en el sitio web.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TerminosCondiciones;
