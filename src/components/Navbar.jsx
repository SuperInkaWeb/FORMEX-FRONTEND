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


  // Mientras Auth0 o el UserContext están cargando, no renderizar nada para evitar lecturas sobre undefined
  if (isLoading || userContext?.loadingUser) {
    return null;
  }

  if (isAuthenticated && !userInfo) return null;

  // 🔜 luego desde roles

  const isActive = (path) =>
    location.pathname === path
      ? 'text-formex-orange font-bold'
      : 'text-gray-600 hover:text-formex-orange font-medium';

  return (
    <nav className={"fixed w-full z-50 transition-all duration-300 border-b bg-white border-transparent py-5"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          <Link to="/" className="flex items-center group">
            <div className="p-1 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
              <div className="bg-white rounded-xl border border-gray-100 px-2 py-1">
                <img
                  src={logoFormex}
                  alt="Formex Logo"
                  className="h-12 w-auto object-contain rounded-lg"
                />
              </div>
            </div>
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
