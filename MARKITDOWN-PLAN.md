# Kế hoạch tích hợp MarkItDown vào pipeline chatbot RAG

> Trạng thái: **BẢN KẾ HOẠCH — chưa triển khai.** Chờ user duyệt.
> Ngày: 2026-07-18. Tác giả: Claude (theo yêu cầu review dự án).

---

## 0. Mục tiêu & phạm vi

**Mục tiêu:** cho phép chatbot RAG nạp tài liệu **đa định dạng** (PDF, DOCX, PPTX, XLSX, HTML, ảnh…) thay vì chỉ `.md/.txt` như hiện nay, bằng cách chèn bước **file → Markdown** (MarkItDown) TRƯỚC pipeline chunk/embed đã có sẵn.

**Nguyên tắc:**
- **Additive, cô lập** — MarkItDown chạy trong container Python riêng; không đụng deps Node, không đổi logic RAG.
- **Fallback an toàn** — nếu service chết hoặc convert lỗi, `.md/.txt` vẫn đi đường cũ; định dạng lạ báo lỗi rõ, KHÔNG làm sập route.
- **Không deploy khi còn job AI chạy trên VPS.**

**Ngoài phạm vi (không đụng):** CV Builder vẫn dùng `cv/extract.service.ts` (mammoth/unpdf) riêng — không hợp nhất lần này.

---

## 1. Kiến trúc

```
Người dùng (admin) upload file
        │  multipart
        ▼
Next.js/Express backend  (Node, container: cuonghoangdev_backend)
  src/routes/ai.routes.ts  ── nếu .md/.txt ─────────────► indexDocument({content})
        │  nếu pdf/docx/pptx/xlsx/…                              (giữ nguyên)
        ▼  POST /convert (multipart, HTTP nội bộ)
MarkItDown service  (Python/FastAPI, container: cuonghoangdev_markitdown) ◄── MỚI
        │  { "markdown": "..." }
        ▼
  src/services/ai.service.ts  indexDocument({ content: markdown })
     → chunkText → computeEmbeddings → documentChunk.create (JSONB)   (giữ nguyên)
```

Điểm chèn code (đã xác minh khi review):
- Ingest RAG: `src/services/ai.service.ts:711` `indexDocument({ documentId, documentType, content, metadata })` — nhận `content: string`, không quan tâm định dạng gốc.
- Route nạp file: `src/routes/ai.routes.ts:36-37` `textUpload` (multer memoryStorage) — hiện chỉ `.md/.txt`.
- RAG chạy bằng **JSONB + cosine in-app** (`aiProviders.ts:608`), Postgres = `postgis/postgis:16-3.4` (KHÔNG pgvector). → **Không cần thêm pgvector.**

---

## 2. Thành phần cần tạo

### A. Service Python — thư mục mới `markitdown-service/`

**`markitdown-service/requirements.txt`** (bản GỌN — chỉ định dạng văn phòng, tránh onnxruntime/torch nặng):
```
markitdown[pdf,docx,pptx,xlsx,xls]
fastapi
uvicorn[standard]
python-multipart
```
> Nếu sau này cần OCR ảnh / transcript audio → đổi thành `markitdown[all]` (nặng hơn nhiều, cân nhắc RAM).

**`markitdown-service/main.py`:**
```python
import tempfile, os
from fastapi import FastAPI, UploadFile, File, HTTPException
from markitdown import MarkItDown

app = FastAPI(title="MarkItDown Service")
md = MarkItDown(enable_plugins=False)

MAX_BYTES = 25 * 1024 * 1024  # 25MB, khớp giới hạn upload backend

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File too large")
    suffix = os.path.splitext(file.filename or "")[1] or ".bin"
    with tempfile.NamedTemporaryFile(delete=True, suffix=suffix) as tmp:
        tmp.write(data); tmp.flush()
        try:
            result = md.convert(tmp.name)
        except Exception as e:
            raise HTTPException(422, f"Convert failed: {e}")
    return {"markdown": result.text_content, "title": result.title}
```
> Bảo mật: `enable_plugins=False`, giới hạn size, chỉ nhận file (không nhận URL → chặn SSRF), chạy trong container non-root, không có secret.

**`markitdown-service/Dockerfile`:**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
# một số converter cần thư viện hệ thống nhẹ
RUN apt-get update && apt-get install -y --no-install-recommends \
      libmagic1 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
RUN adduser --disabled-password --gecos "" appuser
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### B. `docker-compose.yml` — thêm service (KHÔNG expose ra ngoài)
```yaml
  markitdown:
    build: ./markitdown-service
    container_name: cuonghoangdev_markitdown
    restart: unless-stopped
    networks:
      - <ĐÚNG network mà backend đang dùng — xác minh trong docker-compose.yml>
    # KHÔNG ports: — chỉ backend gọi nội bộ qua tên service
```
> Backend thêm `depends_on: [markitdown]` (tùy chọn) + biến env `MARKITDOWN_URL`.
> `docker-compose.ghcr.yml` (workflow GitHub) cũng phải thêm tương ứng nếu dùng đường push-deploy.

### C. Node client — `src/services/markitdown.service.ts` (MỚI)
```ts
import { config } from '../config/env';

const BASE = process.env.MARKITDOWN_URL || 'http://markitdown:8000';

/** Chuyển 1 file bất kỳ sang Markdown qua MarkItDown service. Ném lỗi để caller fallback. */
export async function fileToMarkdown(buf: Buffer, filename: string): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([buf]), filename);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60_000); // timeout 60s
  try {
    const res = await fetch(`${BASE}/convert`, { method: 'POST', body: form, signal: ctrl.signal });
    if (!res.ok) throw new Error(`MarkItDown ${res.status}`);
    const json = (await res.json()) as { markdown?: string };
    if (!json.markdown?.trim()) throw new Error('MarkItDown empty result');
    return json.markdown;
  } finally { clearTimeout(t); }
}
```

### D. Sửa route nạp tài liệu — `src/routes/ai.routes.ts`
- Mở rộng `textUpload` fileFilter cho pdf/docx/pptx/xlsx (giữ .md/.txt).
- Trong handler: nếu ext ∈ {.md,.txt} → đọc buffer thành string như cũ; ngược lại → `fileToMarkdown(buf, name)`; rồi gọi CÙNG `aiService.indexDocument({ documentId, documentType, content })`.
- **Fallback:** bọc `fileToMarkdown` trong try/catch → lỗi thì trả 422 "không chuyển đổi được file này" (KHÔNG 500, KHÔNG sập route). .md/.txt không phụ thuộc service nên vẫn sống nếu MarkItDown chết.

### E. Env vars
| Nơi | Biến |
|---|---|
| `.env` (local) | `MARKITDOWN_URL=http://markitdown:8000` |
| `.env.example` | thêm dòng document |
| `docker-compose.yml` backend env | `MARKITDOWN_URL` |
| **GitHub Actions secrets** | (nếu cần) ⚠️ user tự thêm |
| **VPS `/opt/cuonghoangdev/.env`** | `MARKITDOWN_URL` ⚠️ user tự thêm — Claude không sửa .env VPS |

---

## 3. Quy trình triển khai (đúng CLAUDE.md, KHÔNG deploy khi job AI chạy)

1. Tạo `markitdown-service/` (3 file) + `markitdown.service.ts` + sửa `ai.routes.ts` + env.
2. `npx tsc --noEmit` (backend) — xanh.
3. `docker build -t markitdown-test ./markitdown-service` — thử build image Python OK (bắt lỗi deps sớm).
4. (tùy chọn) chạy thử local: `docker run` service + curl `/convert` với 1 pdf mẫu.
5. **CHỜ 9 job AI trên VPS cạn** (monitor `b5ny19y02`).
6. Thêm `$DC build markitdown` vào `deploy.sh:209-221` (build tuần tự, trước/sau backend).
7. Thêm route health `markitdown` vào smoke-test của deploy.sh (tùy chọn).
8. `bash deploy.sh` → **user test production** → `git push` (theo Forbidden Actions).
9. **Nhắc user** thêm `MARKITDOWN_URL` vào VPS `/opt/cuonghoangdev/.env` + GH secrets TRƯỚC khi deploy.

---

## 4. Test / smoke
- `GET /health` service → `{ok:true}`.
- `POST /convert` với pdf/docx/pptx/xlsx mẫu → có markdown.
- Nạp 1 pdf qua admin → kiểm tra `documentChunk` có bản ghi mới (psql).
- Hỏi chatbot về nội dung pdf đó → thấy nó trích được (RAG hoạt động).
- Test fallback: tắt container markitdown → nạp .md vẫn OK, nạp pdf báo 422 gọn (không 500).

## 5. Rollback
- Service cô lập → rollback = gỡ service khỏi compose + revert 2 file Node. Không migration, không đụng DB → an toàn.
- `git revert <commit>` nếu đã push.

## 6. Rủi ro & giảm thiểu
| Rủi ro | Giảm thiểu |
|---|---|
| Image Python nặng/RAM | Bản gọn (không `[all]`); VPS 8GB+8GB swap+4CPU đủ |
| Convert lỗi/định dạng lạ | try/catch → 422, fallback .md/.txt đường cũ |
| Service chết | `restart: unless-stopped` + health; .md/.txt không phụ thuộc |
| Input độc hại | Giới hạn size/timeout, `enable_plugins=False`, non-root, không nhận URL |
| Deploy OOM | Build tuần tự; VPS đã 8GB |

## 7. Checklist trước push
- [ ] `npx tsc --noEmit` xanh
- [ ] `docker build ./markitdown-service` OK
- [ ] Job AI đã cạn (không deploy đè)
- [ ] `MARKITDOWN_URL` có ở VPS .env + compose
- [ ] Smoke: /health + /convert + nạp pdf + hỏi chatbot + test fallback
- [ ] User test prod trước khi push
