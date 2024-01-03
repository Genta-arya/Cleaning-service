// server.js
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './path/to/App';  // Gantilah dengan path ke aplikasi React Anda

const server = express();

server.use(express.static('public'));  // Jika Anda memiliki folder 'public' untuk file statis

server.get('*', (req, res) => {
  const helmetContext = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>
  );

  const html = renderToString(app);
  const { helmet } = helmetContext;

  res.send(`
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${html}</div>
        <script src="/path/to/your/bundle.js"></script>
      </body>
    </html>
  `);
});



