Chép từ `node_modules/pyodide` lúc thêm hộp cát Python (17/08/2026).

⚠️ ĐỪNG sửa tay. Nâng cấp gói `pyodide` thì chép lại đúng năm file này:
  pyodide.mjs · pyodide.asm.mjs · pyodide.asm.wasm · python_stdlib.zip · pyodide-lock.json

Vì sao chép vào `public/` thay vì `import` từ node_modules: Pyodide nạp
`.wasm` và `python_stdlib.zip` bằng `fetch` lúc chạy, theo `indexURL`. Bundler
không gói được những file đó, và CSP của app chỉ cho tải tài nguyên từ chính
origin `app://` — nên chúng phải là file tĩnh nằm trong bản dựng.
