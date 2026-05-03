import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import logoFormex from "../assets/formex_logo.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import { useAuth } from '../context/AuthContext';
import { getRoleNames } from '../utils/roles';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  // 🔹 HOOKS SIEMPRE ARRIBA
  const [isOpen, setIsOpen] = useState(false);
  const userContext = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();
  const userInfo = userContext?.userInfo;
  const authUser = auth ? auth.user : null; // obtener usuario normalizado via useAuth hook de AuthContext

  const roleNames = getRoleNames({ userInfo, authUser });
  const isStudent = roleNames.includes("ROLE_STUDENT");

  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

useEffect(() => {
  if (!isAuthenticated || !userInfo) return;

  const localRoles = roleNames;
  const isLoginCallbackPage =
    location.pathname === "/login" || location.pathname === "/callback";

  if (!isLoginCallbackPage) return;

  if (localRoles.includes("ROLE_ADMIN")) navigate("/admin", { replace: true });
  else if (localRoles.includes("ROLE_INSTRUCTOR")) navigate("/instructor", { replace: true });
  else if (localRoles.includes("ROLE_STUDENT")) navigate("/student", { replace: true });
}, [isAuthenticated, userInfo, roleNames, location.pathname, navigate]);


  // Las validaciones de carga ahora se manejan visualmente en el render para no ocultar toda la barra
  const isComponentLoading = isLoading || userContext?.loadingUser;

  // 🔜 luego desde roles

  const isActive = (path) =>
    location.pathname === path
      ? 'text-formex-orange font-bold'
      : 'text-gray-600 hover:text-formex-orange font-medium';

  return (
    <nav className={"fixed w-full z-50 transition-all duration-300 border-b bg-white border-transparent py-5"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105 active:scale-95">
            <div className="p-0.5 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
                <img
                  src={logoFormex}
                  alt="Formex Logo"
                  className="h-14 w-auto object-cover rounded-xl"
                />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Inicio</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Cursos</Link>
            <Link to="/about" className={isActive('/about')}>Nosotros</Link>
            <Link to="/blog" className={isActive('/blog')}>Blog</Link>
            <Link to="/instructors" className={isActive('/instructors')}>Instructores</Link>
            <Link to="/faq" className={isActive('/faq')}>Ayuda</Link>
            <Link to="/support" className={isActive('/support')}>Contáctanos</Link>


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

          {isComponentLoading ? (
            <div className="flex items-center justify-center px-6 py-3">
              <div className="w-5 h-5 border-2 border-formex-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (!isAuthenticated || !userInfo) ? (
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

      {/* ── MENÚ MÓVIL DESPLEGABLE ── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">

            {/* Links de navegación */}
            {[
              { to: '/',            label: 'Inicio' },
              { to: '/catalog',     label: 'Cursos' },
              { to: '/about',       label: 'Nosotros' },
              { to: '/blog',        label: 'Blog' },
              { to: '/instructors', label: 'Instructores' },
              { to: '/faq',         label: 'Ayuda' },
              { to: '/support',     label: 'Contáctanos' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-formex-orange bg-orange-50 font-bold'
                    : 'text-gray-600 hover:text-formex-orange hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Botón Intranet (solo estudiante) */}
            {isStudent && (
              <Link
                to="/student"
                onClick={() => setIsOpen(false)}
                className="mt-2 py-3 px-4 rounded-lg text-sm font-bold text-formex-orange bg-formex-orange/10 hover:bg-formex-orange hover:text-white transition-all"
              >
                Intranet
              </Link>
            )}

            {/* Separador */}
            <div className="border-t border-gray-100 my-2" />

            {/* Auth */}
            {isComponentLoading ? (
              <div className="flex justify-center py-3">
                <div className="w-5 h-5 border-2 border-formex-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (!isAuthenticated || !userInfo) ? (
              <button
                onClick={() => { setIsOpen(false); loginWithRedirect(); }}
                className="w-full py-3 bg-formex-dark text-white font-bold rounded-lg text-sm"
              >
                Ingresar / Registrarse
              </button>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-bold text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); logout({ logoutParams: { returnTo: window.location.origin } }); }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
