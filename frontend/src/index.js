import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Your main application component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);