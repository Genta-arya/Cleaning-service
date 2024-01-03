import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import App from "./Route/App";
import { Provider } from "react-redux";
import { store } from "./Feature/Redux/store";

const root = document.getElementById("root");

ReactDOM.hydrate(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
  root
);



reportWebVitals();
