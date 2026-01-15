export const getDashboardRoute = (roles) => {
  if (roles.some(r => r.name === "ROLE_ADMIN")) return "/admin";
  if (roles.some(r => r.name === "ROLE_INSTRUCTOR")) return "/instructor";
  if (roles.some(r => r.name === "ROLE_STUDENT")) return "/student";
  return "/"; // fallback
};
