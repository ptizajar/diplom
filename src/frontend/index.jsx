import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// точка входа, Ищет id app в html
const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
