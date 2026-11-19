// src/index.js — điểm vào (đã cho sẵn). Tự nạp CSS Bootstrap + bọc router.
import React from "react";
import ReactDOM from "react-dom/client";
// TODO: import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
