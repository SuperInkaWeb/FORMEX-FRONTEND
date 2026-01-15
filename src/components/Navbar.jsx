import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import logoFormex from "../assets/formex_logo.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  // 🔹 HOOKS SIEMPRE ARRIBA
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 const userContext = useUser();
 const navigate = useNavigate();

const userInfo = userContext?.userInfo;


 const roleNames = userInfo?.roles?.map(r => r.name) || [];

const isStudent = roleNames.includes("ROLE_STUDENT");
const isAdmin = roleNames.includes("ROLE_ADMIN");
const isInstructor = roleNames.includes("ROLE_INSTRUCTOR");
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

  const location = useLocation();
useEffect(() => {
  // 1️⃣ Espera auth y user
  if (!isAuthenticated || !userInfo) return;

  const roleNames = userInfo.roles?.map(r => r.name) || [];

  // 2️⃣ SOLO páginas públicas
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/catalog") ||
    location.pathname.startsWith("/about") ||
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/faq");

  if (!isPublicPage) return;

  // 3️⃣ ADMIN
  if (
    roleNames.includes("ROLE_ADMIN") &&
    location.pathname !== "/admin"
  ) {
    navigate("/admin", { replace: true });
    return;
  }

  // 4️⃣ INSTRUCTOR
  if (
    roleNames.includes("ROLE_INSTRUCTOR") &&
    location.pathname !== "/instructor"
  ) {
    navigate("/instructor", { replace: true });
    return;
  }

  // 5️⃣ ESTUDIANTE → NO SE TOCA
}, [isAuthenticated, userInfo, location.pathname, navigate]);


  // 🔹 DESPUÉS de los hooks, recién acá decides renderizar
  if (isLoading) return null;

if (isAuthenticated && !userInfo) return null;

// 🔜 luego desde roles

  const isActive = (path) =>
    location.pathname === path
      ? 'text-formex-orange font-bold'
      : 'text-gray-600 hover:text-formex-orange font-medium';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-gray-100 py-3 shadow-sm' : 'bg-white border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          <Link to="/" className="flex items-center group">
            <img src={logoFormex} alt="Formex Logo" className="h-12 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Inicio</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Cursos</Link>
            <Link to="/about" className={isActive('/about')}>Nosotros</Link>
            <Link to="/blog" className={isActive('/blog')}>Blog</Link>
            <Link to="/faq" className={isActive('/faq')}>Ayuda</Link>


          {/* Botón Intranet dinámico */}
{isStudent && (
  <Link
    to="/student"
    className="px-5 py-2.5 rounded-lg font-bold
               text-formex-orange bg-formex-orange/10
               hover:bg-formex-orange hover:text-white
               transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  >
    Intranet
  </Link>
)}

          </div>

          {!isAuthenticated ? (
            <>
           <button
            onClick={() => loginWithRedirect()}
          className="px-6 py-3 bg-formex-dark text-white font-bold rounded-lg"
            >
          Ingresar / Registrarse
           </button>

            </>
          ) : (
            <div className="flex items-center gap-3 border-l pl-4">
              <User size={18} />
              <span className="font-bold">{user?.name}</span>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
