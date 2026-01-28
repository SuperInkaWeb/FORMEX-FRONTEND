// Utilidades para normalizar roles desde distintos orígenes (token/Auth0, backend)
export function normalizeRoles(arr) {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];
  return arr
    .map(r => {
      const raw = (typeof r === 'string' ? r : (r.name || r.authority || r.role || '')) || '';
      return raw.trim().toUpperCase();
    })
    .filter(Boolean);
}

export function getRoleNames({ userInfo, authUser } = {}) {
  // authUser: objeto de auth0.user (puede tener claim https://formex.com/roles)
  // userInfo: objeto devuelto por backend (puede tener roles como objetos)
  // Priorizar roles del token (authUser) si existen
  const namespace = 'https://formex.com/roles';

  const authRolesClaim = authUser?.[namespace] || authUser?.roles || null;
  const authRoles = normalizeRoles(authRolesClaim);

  if (authRoles && authRoles.length > 0) {
    // Usar únicamente roles del token como fuente autoritativa
    return Array.from(new Set(authRoles));
  }

  // Si no hay roles en el token, caer a backend
  const backendRolesRaw = userInfo?.roles || [];
  const backendRoles = normalizeRoles(backendRolesRaw);
  return Array.from(new Set(backendRoles));
}
