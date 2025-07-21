import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import "@/styles/serpentine.css";
import {ToastProvider} from "@heroui/toast";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <ToastProvider />

        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
