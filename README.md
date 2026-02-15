# 📘 FORMEX - Frontend

SPA moderna para la plataforma educativa FORMEX, un LMS enfocado en cursos en vivo con sincronización, mentoría y comunidad. 

---

## Stack Tecnológico

- **Framework:** React 18
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **HTTP Client:** Axios (con interceptores para JWT)
- **Ruteo:** React Router Dom 6
- **Estado Global:** React Context API (AuthContext)

---

## Configuración del Entorno

### Requisitos Previos

- Node.js (v18 o superior)
- Backend corriendo en `http://localhost:8080`

### Instalación

1. Clonar el repositorio: 

```bash
git clone https://github.com/SuperInkaWeb/FORMEX-frontend.git
cd FORMEX-frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (opcional):

Crear archivo `.env` en la raíz: 

```env
VITE_API_URL=http://localhost:8080
```

4. Ejecutar servidor de desarrollo:

```bash
npm run dev
```

5. Acceder a [http://localhost:5173](http://localhost:5173)

---

## Arquitectura y Estructura

### Estructura del Proyecto (`src`)

- **/components:** Componentes reutilizables
  - `Navbar.jsx` - Barra de navegación con autenticación
  - `Footer.jsx` - Pie de página
  - `ProtectedRoute.jsx` - Protección de rutas por rol
  
- **/context:** Manejo de estado global
  - `AuthContext.jsx` - Gestión de sesión y autenticación
  
- **/pages:** Vistas organizadas por módulos
  - **/main:** Páginas públicas (Home, About, Blog)
  - **/auth:** Login, Registro, Reset Password
  - **/admin:** Dashboard, UsersManager, CoursesManager
  - **/courses:** Catálogo público y Detalle
  
- **/services:** Llamadas a la API
  - `api.js` - Configuración de Axios con interceptores JWT
  - `courseService.js` - Servicios relacionados con cursos
  - `adminService.js` - Servicios de administración

---

## Rutas Principales

### Públicas
- `/` - Landing Page
- `/about` - Sobre Nosotros
- `/courses` - Catálogo de Cursos
- `/courses/:id` - Detalle de Curso
- `/blog` - Blog
- `/support` - Soporte

### Autenticación
- `/login` - Inicio de Sesión
- `/register` - Registro
- `/forgot-password` - Recuperación de Contraseña
- `/reset-password/: token` - Cambiar Contraseña

### Admin (Protegidas - ROLE_ADMIN)
- `/admin/dashboard` - Panel de Control
- `/admin/users` - Gestión de Usuarios
- `/admin/courses` - Gestión de Cursos

---

## Funcionalidades Implementadas ✅

- ✅ Sistema de autenticación completo (Login/Registro/Recuperación)
- ✅ Protección de rutas por roles
- ✅ Panel de administración con gestión de usuarios
- ✅ CRUD completo de cursos desde admin
- ✅ Catálogo público de cursos
- ✅ Detalle de curso con información completa
- ✅ Subida de imágenes de portada
- ✅ Formulario de soporte con envío de email
- ✅ Páginas públicas (Home, About, Blog)

---

## Próximos Pasos 🚧

### Prioridad Alta
- **Página de Matrícula:** Botón "Inscribirme" en detalle de curso
- **Aula Virtual:** Vista `src/pages/student/MyCourses.jsx` para cursos inscritos
- **Contenido del Curso:** Interfaz para ver módulos y lecciones

### Prioridad Media
- **Pasarela de Pagos:** Integración con Stripe/PayPal
- **Panel de Tickets:** Vista admin para gestionar tickets de soporte
- **Perfil de Usuario:** Edición de datos personales

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linter
npm run lint
```

---

## Configuración de CORS

El frontend está configurado para comunicarse con el backend en `http://localhost:8080`. 

Si el backend está en otro dominio, actualizar en `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'TU_URL_BACKEND',
  headers:  {
    'Content-Type':  'application/json',
  },
});
```

---

## Despliegue

### Recomendaciones para Producción

- **Vercel** (Recomendado): Conexión directa con GitHub
- **Netlify**: Configurar redirects para React Router
- **AWS S3 + CloudFront**: Para mayor control

**Nota:** Actualizar CORS en el backend para permitir el dominio de producción.

---

## Repositorio Backend

🔗 [FORMEX Backend Repository](https://github.com/SuperInkaWeb/FORMEX)

---

## 📧 Contacto

**Email:** faridlazo1921@gmail. com

---
