import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
