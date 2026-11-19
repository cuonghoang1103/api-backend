// src/index.js — điểm vào (đã cho sẵn). Câu 1: tự nạp CSS Bootstrap + bọc router.
import React from 'react';
import ReactDOM from 'react-dom/client';
// TODO (Câu 1): import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
