Chép từ `node_modules/pyodide` lúc thêm hộp cát Python (17/08/2026).

⚠️ ĐỪNG sửa tay. Nâng cấp gói `pyodide` thì chép lại đúng năm file này:
  pyodide.mjs · pyodide.asm.mjs · pyodide.asm.wasm · python_stdlib.zip · pyodide-lock.json

Vì sao chép vào `public/` thay vì `import` từ node_modules: Pyodide nạp
`.wasm` và `python_stdlib.zip` bằng `fetch` lúc chạy, theo `indexURL`. Bundler
không gói được những file đó, và CSP của app chỉ cho tải tài nguyên từ chính
origin `app://` — nên chúng phải là file tĩnh nằm trong bản dựng.

## Gói khoa học (17/08/2026)

13 file `.whl` cạnh đây là numpy · pandas · matplotlib cùng toàn bộ phụ thuộc —
**17 MB**. Chúng KHÔNG đi kèm gói npm `pyodide`; lấy lại bằng:

```bash
node scripts/tai-goi-python.mjs                # numpy · pandas · matplotlib
node scripts/tai-goi-python.mjs scipy sympy    # thêm gói khác
```

Vì sao để trên đĩa chứ không lấy từ CDN lúc chạy: cả điểm của hộp cát là chạy
được KHÔNG cần mạng, và CSP của app chỉ cho tải tài nguyên từ chính origin
`app://`. Lấy từ CDN nghĩa là nới `connect-src` cho một tên miền ngoài và mỗi
lần bấm Chạy lại phụ thuộc đường truyền.

`pyodide-lock.json` khai báo 356 gói nhưng chỉ những file có mặt ở đây mới nạp
được — `loadPackagesFromImports` sẽ 404 với phần còn lại. Đó là chủ ý: thêm gói
là thêm dung lượng bản cài, nên phải quyết định từng cái.
