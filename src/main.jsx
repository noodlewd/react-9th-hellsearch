import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import HealthProvider from "./context/HealthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HealthProvider>
      <App />
    </HealthProvider>
  </StrictMode>
);
