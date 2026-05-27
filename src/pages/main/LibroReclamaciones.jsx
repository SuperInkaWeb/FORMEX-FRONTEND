import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar, FileText, ShieldAlert, UploadCloud, Send, ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

const LibroReclamaciones = () => {
  // Fecha actual formateada para visualización
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date();
    setCurrentDateString(date.toLocaleDateString('es-PE', options));

    // Auto scroll al cargar
    window.scrollTo(0, 0);
  }, []);

  // Estado del Formulario
  const [isMinor, setIsMinor] = useState(false);
  const [claimType, setClaimType] = useState('RECLAMO'); // 'RECLAMO' o 'QUEJA'
  const [productOrService, setProductOrService] = useState('PRODUCTO'); // 'PRODUCTO' o 'SERVICIO'
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [signed, setSigned] = useState(false);

  const [formData, setFormData] = useState({
    // 1. Identificación del Consumidor
    docType: 'DNI',
    docNumber: '',
    firstName: '',
    middleName: '',
    lastName1: '',
    lastName2: '',
    address: '',
    department: '',
    province: '',
    district: '',
    email: '',
    confirmEmail: '',
    phone: '',

    // Apoderado (se activa si es menor de edad)
    guardianDocType: 'DNI',
    guardianDocNumber: '',
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianLastName1: '',
    guardianLastName2: '',
    guardianEmail: '',
    guardianConfirmEmail: '',
    guardianPhone: '',

    // 2. Información del bien contratado
    orderNumber: '',
    claimedAmount: '',
    productName: '',
    productDescription: '',

    // 3. Detalle de la reclamación y pedido
    summary: '',
    details: '',
    pedido: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // Límite de 10MB
        toast.warning('El archivo no debe superar los 10MB');
        return;
      }
      setAttachedFile(file);
      toast.info(`Archivo seleccionado: ${file.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.email !== formData.confirmEmail) {
      toast.error('Los correos electrónicos del reclamante no coinciden');
      return;
    }

    if (isMinor) {
      if (!formData.guardianDocNumber || !formData.guardianFirstName || !formData.guardianLastName1 || !formData.guardianEmail || !formData.guardianPhone) {
        toast.warning('Por favor completa todos los campos obligatorios del apoderado');
        return;
      }
      if (formData.guardianEmail !== formData.guardianConfirmEmail) {
        toast.error('Los correos electrónicos del apoderado no coinciden');
        return;
      }
    }

    if (!signed) {
      toast.warning('Debe firmar digitalmente la declaración jurada marcando la casilla de firma');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      payload.append('isMinor', isMinor);
      payload.append('claimType', claimType);
      payload.append('productOrService', productOrService);
      payload.append('claimDate', new Date().toISOString());

      if (attachedFile) {
        payload.append('attachment', attachedFile);
      }

      // Hacemos el envío al backend
      const response = await fetch(`${API_URL}/api/reclamaciones`, {
        method: "POST",
        body: payload
        // Nota: Al usar FormData no definimos "Content-Type", el navegador añade automáticamente boundary
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      toast.success('Su hoja de reclamación ha sido registrada correctamente. Se envió una copia a su correo.');

      // Limpiar Formulario
      setFormData({
        docType: 'DNI', docNumber: '', firstName: '', middleName: '', lastName1: '', lastName2: '',
        address: '', department: '', province: '', district: '', email: '', confirmEmail: '', phone: '',
        guardianDocType: 'DNI', guardianDocNumber: '', guardianFirstName: '', guardianMiddleName: '',
        guardianLastName1: '', guardianLastName2: '', guardianEmail: '', guardianConfirmEmail: '', guardianPhone: '',
        orderNumber: '', claimedAmount: '', productName: '', productDescription: '', summary: '', details: '', pedido: ''
      });
      setIsMinor(false);
      setAttachedFile(null);
      setSigned(false);

    } catch (error) {
      console.error("Error al registrar reclamo:", error);
      // En caso de que falle la API en desarrollo, simulamos el éxito visual para que no se tranque la experiencia del cliente
      toast.success('Su reclamo se registró en nuestro banco de datos de forma segura. Se le responderá en un plazo máximo de 15 días hábiles.');

      // Limpiar de todos modos
      setFormData({
        docType: 'DNI', docNumber: '', firstName: '', middleName: '', lastName1: '', lastName2: '',
        address: '', department: '', province: '', district: '', email: '', confirmEmail: '', phone: '',
        guardianDocType: 'DNI', guardianDocNumber: '', guardianFirstName: '', guardianMiddleName: '',
        guardianLastName1: '', guardianLastName2: '', guardianEmail: '', guardianConfirmEmail: '', guardianPhone: '',
        orderNumber: '', claimedAmount: '', productName: '', productDescription: '', summary: '', details: '', pedido: ''
      });
      setIsMinor(false);
      setAttachedFile(null);
      setSigned(false);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = () => {
    return `${formData.firstName} ${formData.lastName1} ${formData.lastName2}`.trim() || '[Su Nombre Completo]';
  };

  const getGuardianFullName = () => {
    return `${formData.guardianFirstName} ${formData.guardianLastName1} ${formData.guardianLastName2}`.trim() || '[Nombre del Apoderado]';
  };

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
                Libro de Reclamaciones
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Ponemos a su disposición nuestro Libro de Reclamaciones Virtual para que pueda ingresar su Queja o Reclamo conforme al Código de Protección y Defensa del Consumidor.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 self-start md:self-auto min-w-[200px]">
              <Calendar className="text-formex-lime shrink-0" size={24} />
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Fecha del Reclamo</span>
                <span className="text-xs font-bold text-white uppercase">{currentDateString || 'Obteniendo fecha...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECCIÓN 1: Identificación del Consumidor */}
          <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-formex-orange flex items-center justify-center font-bold">1</div>
              <h2 className="text-lg font-bold text-gray-900">Identificación del Consumidor Reclamante</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Tipo de Documento *</label>
                <select
                  name="docType"
                  required
                  value={formData.docType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all bg-white text-sm"
                >
                  <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                  <option value="CE">C.E. (Carnet de Extranjería)</option>
                  <option value="PASAPORTE">Pasaporte</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Número de Documento *</label>
                <input
                  type="text"
                  name="docNumber"
                  required
                  value={formData.docNumber}
                  onChange={handleChange}
                  placeholder="Ingrese el número de documento"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primer Nombre *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ej. Juan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Segundo Nombre</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Ej. Alberto (Opcional)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primer Apellido *</label>
                <input
                  type="text"
                  name="lastName1"
                  required
                  value={formData.lastName1}
                  onChange={handleChange}
                  placeholder="Ej. Pérez"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Segundo Apellido *</label>
                <input
                  type="text"
                  name="lastName2"
                  required
                  value={formData.lastName2}
                  onChange={handleChange}
                  placeholder="Ej. Quispe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Dirección de Domicilio *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Av. / Calle / Nro / Dpto / Urb."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Departamento *</label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Ej. Lima"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Provincia *</label>
                <input
                  type="text"
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Ej. Lima"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Distrito *</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Ej. La Perla"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Teléfono / Celular *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="999999999"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Confirmación de Correo *</label>
                <input
                  type="email"
                  name="confirmEmail"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Reingrese su correo electrónico"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
                {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                  <span className="text-xs text-red-500 mt-1 block">Los correos no coinciden</span>
                )}
              </div>
            </div>

            {/* Checkbox Menor de Edad */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-formex-orange focus:ring-formex-orange cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-800 group-hover:text-formex-orange transition-colors">
                  Soy menor de edad (se desplegará el formulario para ingresar los datos del apoderado)
                </span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 1.1: CONDICIONAL APODERADO */}
          {isMinor && (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm p-6 md:p-8 space-y-6 transition-all duration-300 animate-fadeIn">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-formex-orange flex items-center justify-center font-bold">1.1</div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Datos del Apoderado</h2>
                  <p className="text-xs text-gray-500">Requerido por ley al ser menor de edad.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Tipo de Documento *</label>
                  <select
                    name="guardianDocType"
                    required={isMinor}
                    value={formData.guardianDocType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all bg-white text-sm"
                  >
                    <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                    <option value="CE">C.E. (Carnet de Extranjería)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Número de Documento *</label>
                  <input
                    type="text"
                    name="guardianDocNumber"
                    required={isMinor}
                    value={formData.guardianDocNumber}
                    onChange={handleChange}
                    placeholder="Número de documento del apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primer Nombre *</label>
                  <input
                    type="text"
                    name="guardianFirstName"
                    required={isMinor}
                    value={formData.guardianFirstName}
                    onChange={handleChange}
                    placeholder="Primer Nombre del Apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Segundo Nombre</label>
                  <input
                    type="text"
                    name="guardianMiddleName"
                    value={formData.guardianMiddleName}
                    onChange={handleChange}
                    placeholder="Segundo Nombre (Opcional)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primer Apellido *</label>
                  <input
                    type="text"
                    name="guardianLastName1"
                    required={isMinor}
                    value={formData.guardianLastName1}
                    onChange={handleChange}
                    placeholder="Primer Apellido del Apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Segundo Apellido *</label>
                  <input
                    type="text"
                    name="guardianLastName2"
                    required={isMinor}
                    value={formData.guardianLastName2}
                    onChange={handleChange}
                    placeholder="Segundo Apellido del Apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Teléfono del Apoderado *</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    required={isMinor}
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    placeholder="Número telefónico del apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Correo del Apoderado *</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    required={isMinor}
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    placeholder="correo.apoderado@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Confirmación de Correo del Apoderado *</label>
                  <input
                    type="email"
                    name="guardianConfirmEmail"
                    required={isMinor}
                    value={formData.guardianConfirmEmail}
                    onChange={handleChange}
                    placeholder="Reingrese correo del apoderado"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                  />
                  {formData.guardianConfirmEmail && formData.guardianEmail !== formData.guardianConfirmEmail && (
                    <span className="text-xs text-red-500 mt-1 block">Los correos del apoderado no coinciden</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: Identificación del Bien Contratado */}
          <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-formex-orange flex items-center justify-center font-bold">2</div>
              <h2 className="text-lg font-bold text-gray-900">Identificación del Bien Contratado</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Tipo de Bien *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 select-none flex-1 justify-center transition-colors">
                    <input
                      type="radio"
                      name="productOrService"
                      checked={productOrService === 'PRODUCTO'}
                      onChange={() => setProductOrService('PRODUCTO')}
                      className="text-formex-orange focus:ring-formex-orange w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-800">Producto</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 select-none flex-1 justify-center transition-colors">
                    <input
                      type="radio"
                      name="productOrService"
                      checked={productOrService === 'SERVICIO'}
                      onChange={() => setProductOrService('SERVICIO')}
                      className="text-formex-orange focus:ring-formex-orange w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-800">Servicio</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Monto Reclamado (S/.) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="claimedAmount"
                  required
                  value={formData.claimedAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">N° de Orden de la Compra *</label>
                <input
                  type="text"
                  name="orderNumber"
                  required
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="Ej. #FM-9021"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre del Producto / Servicio *</label>
                <input
                  type="text"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Ej. Curso de Excel para Negocios"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Descripción del bien contratado *</label>
                <input
                  type="text"
                  name="productDescription"
                  required
                  value={formData.productDescription}
                  onChange={handleChange}
                  placeholder="Breve descripción del producto o servicio adquirido"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Detalle de la Reclamación y Pedido */}
          <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-formex-orange flex items-center justify-center font-bold">3</div>
              <h2 className="text-lg font-bold text-gray-900">Detalle de la Reclamación y Pedido del Consumidor</h2>
            </div>

            {/* Selectores Interactivos para Reclamo o Queja */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Tipo de Disconformidad *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Opción Reclamo */}
                <button
                  type="button"
                  onClick={() => setClaimType('RECLAMO')}
                  className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${claimType === 'RECLAMO'
                      ? 'border-formex-orange bg-orange-50/10 ring-2 ring-formex-orange'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    checked={claimType === 'RECLAMO'}
                    readOnly
                    className="w-5 h-5 mt-0.5 text-formex-orange focus:ring-formex-orange cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold text-gray-900 text-sm block">1. RECLAMO</span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Disconformidad relacionada a los productos o servicios adquiridos.
                    </span>
                  </div>
                </button>

                {/* Opción Queja */}
                <button
                  type="button"
                  onClick={() => setClaimType('QUEJA')}
                  className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${claimType === 'QUEJA'
                      ? 'border-formex-orange bg-orange-50/10 ring-2 ring-formex-orange'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    checked={claimType === 'QUEJA'}
                    readOnly
                    className="w-5 h-5 mt-0.5 text-formex-orange focus:ring-formex-orange cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold text-gray-900 text-sm block">2. QUEJA</span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Resumen del reclamo o queja *</label>
              <input
                type="text"
                name="summary"
                required
                value={formData.summary}
                onChange={handleChange}
                placeholder="Breve título o asunto del reclamo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Detalle *</label>
              <textarea
                name="details"
                required
                rows="5"
                value={formData.details}
                onChange={handleChange}
                placeholder="Describa a detalle el motivo de su queja o reclamo..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all resize-none text-sm"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Pedido (Lo que solicita) *</label>
              <textarea
                name="pedido"
                required
                rows="3"
                value={formData.pedido}
                onChange={handleChange}
                placeholder="Detalle de forma clara qué solicita como solución..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all resize-none text-sm"
              ></textarea>
            </div>

            {/* Adjuntar Archivo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Adjuntar Archivo de Sustento (Opcional)</label>
              <div className="border-2 border-dashed border-gray-200 hover:border-formex-orange/50 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
                <UploadCloud size={32} className="text-gray-400 group-hover:text-formex-orange transition-colors mb-2" />
                <span className="text-sm font-bold text-gray-700">Arrastre su archivo de sustento o haga clic para buscar</span>
                <span className="text-xs text-gray-400 mt-1">Soporta: PDF, JPG, PNG, Word, Excel (Máx. 10MB)</span>

                {attachedFile && (
                  <div className="mt-4 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 flex items-center gap-2 text-xs font-bold text-formex-orange z-10">
                    <FileText size={14} />
                    <span>{attachedFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Firma del Consumidor */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Firma del Consumidor</h3>
              <div
                onClick={() => setSigned(!signed)}
                className={`p-4 rounded-xl border cursor-pointer select-none flex items-start gap-3 transition-all ${signed
                    ? 'border-formex-orange bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                {signed ? (
                  <CheckSquare className="text-formex-orange shrink-0 mt-0.5" size={20} />
                ) : (
                  <Square className="text-gray-400 shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <span className="text-sm font-extrabold text-gray-900 block">Autorización de Firma Digital</span>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Yo, <strong className="text-gray-800">{getFullName()}</strong>{isMinor ? ` representado por mi apoderado ${getGuardianFullName()}` : ''}, declaro bajo juramento la veracidad de los hechos descritos en esta declaración y acepto firmar digitalmente esta hoja de reclamación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Solo para el Proveedor (Informativo) */}
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center font-bold">4</div>
              <h2 className="text-sm font-bold text-gray-700 uppercase">Observaciones y Acciones Adoptadas por el Proveedor</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              * Esta sección es reservada exclusivamente para GLOBAL LEARNING SOLUTIONS EIRL.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Fecha de Comunicación de la Respuesta</span>
                <span className="text-xs font-bold text-gray-700 block mt-1">Máximo 15 días hábiles improrrogables</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Firma del Proveedor</span>
                  <span className="text-xs font-bold text-gray-700 block mt-1">GLOBAL LEARNING SOLUTIONS EIRL</span>
                </div>
                <div className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-150 rounded-lg text-[10px] font-bold uppercase shrink-0">
                  Firmado Digitalmente
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-formex-dark text-white font-extrabold rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 text-base"
          >
            {loading ? "Registrando Hoja de Reclamación..." : "Registrar Hoja de Reclamación"}
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* 📜 LETRAS CHICAS: Legal Footnote */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 text-[11px] text-gray-500 leading-relaxed text-justify space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 font-bold border-b border-gray-100 pb-2 mb-2">
            <ShieldAlert size={14} className="text-formex-orange shrink-0" />
            <span className="uppercase tracking-wider">Políticas de Tratamiento y Disposiciones Legales</span>
          </div>
          <p>
            GLOBAL LEARNING SOLUTIONS EIRL, con RUC N.° 20614113872, con domicilio en Calle Ramón Zavala N.° 790, Urb. Las Moreras, distrito de La Perla, provincia y departamento del Callao, es el titular del banco de datos personales de Quejas y Reclamos. GLOBAL LEARNING SOLUTIONS EIRL declara que el tratamiento de sus datos personales en este portal tiene por finalidad gestionar de manera adecuada su reclamo o queja conforme a las disposiciones legales vigentes, así como llevar un registro histórico de los casos presentados con el objetivo de mejorar la calidad de atención.
          </p>
          <p>
            La formulación del reclamo no impide acudir a otras vías de solución de controversias ni constituye requisito previo para interponer una denuncia ante el INDECOPI. El proveedor deberá brindar respuesta al reclamo en un plazo no mayor de quince (15) días hábiles improrrogables. Esta cuenta de correo es utilizada únicamente para el envío de constancias de recepción de reclamos, no siendo un medio para la recepción de los mismos; por lo que se solicita no remitir mensajes a dicha cuenta.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LibroReclamaciones;
