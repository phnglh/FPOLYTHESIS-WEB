import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { StyledEngineProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { App } from "@/app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <App />
      </StyledEngineProvider>
    </BrowserRouter>
  </StrictMode>
);
