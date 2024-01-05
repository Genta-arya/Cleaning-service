import React from "react";
import { createRoot } from "react-dom/client";  // Correct import statement
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import App from "./Route/App";
import { Provider } from "react-redux";
import { store } from "./Feature/Redux/store";

const root = document.getElementById("root");

const rootElement = createRoot(root);  // Use createRoot from "react-dom/client"

rootElement.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
