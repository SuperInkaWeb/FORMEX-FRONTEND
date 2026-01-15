// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-pdyaf2k048teshn7.us.auth0.com"
    clientId="ky3qfk5sBb4KBMaM0mbHIPDlOPpnFlQ2"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://api.formex.com",
      scope: "openid profile email"
    }}
    cacheLocation="localstorage" // 🔑 persistencia de sesión 
    useRefreshTokens={true} // 🔑 refrescar tokens automáticamente
  >
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </Auth0Provider>
);
