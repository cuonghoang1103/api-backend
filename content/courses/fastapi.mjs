/**
 * FastAPI — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm của 11 khoá khung
 * trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá Python; nền Python song song với khoá Node.js cho phía backend.
 * Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'fastapi',
    title: 'FastAPI',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/fastapi.png?v=1',
    shortDescription: 'Build production APIs with FastAPI: routing, Pydantic v2, dependency injection, SQLModel + PostgreSQL, JWT auth, background tasks, SSE streaming for AI responses, testing and Docker deploy.|||Xây API production với FastAPI: routing, Pydantic v2, dependency injection, SQLModel + PostgreSQL, xác thực JWT, tác vụ nền, streaming SSE cho AI, testing và deploy Docker.',
    description: 'Khoá FastAPI đi từ route và Pydantic model tới một API production thật. Nội dung: định tuyến và tham số path/query/body, Pydantic v2 (validate, serialize, response_model), dependency injection với Depends, SQLModel/SQLAlchemy 2.0 + PostgreSQL cùng migration bằng Alembic, xác thực JWT với OAuth2PasswordBearer, background task, streaming Server-Sent Events cho phản hồi AI theo thời gian thực, xử lý lỗi và middleware, test với pytest + httpx.AsyncClient, và đóng gói Docker để deploy. Ví dụ xuyên suốt là một API có tích hợp gọi LLM streaming — đúng dạng backend đang cần cho các ứng dụng AI hiện nay.',
    whatYouLearn: 'Thiết kế route rõ ràng với path/query/body param được validate tự động; làm chủ Pydantic v2 cho input lẫn output; dùng Depends để chia sẻ logic (DB session, auth, phân trang) không lặp code; nối PostgreSQL qua SQLModel/SQLAlchemy 2.0 với Alembic quản lý migration; dựng xác thực JWT chuẩn OAuth2; chạy tác vụ nền không chặn response; trả lời dạng streaming (SSE) cho ứng dụng AI; viết test async đầy đủ; và đóng gói Docker + Uvicorn/Gunicorn để deploy.',
    requirements: 'Biết Python ở mức khoá "Python for Backend & AI" trên trang này (hàm, class, type hint, async/await cơ bản). Nên biết SQL cơ bản. Có PostgreSQL chạy được, dùng Docker là nhanh nhất (khoá Docker của CuongThai bao phần đó).',
    documentsNote: 'Tài liệu chính: fastapi.tiangolo.com • docs.pydantic.dev (v2) • docs.sqlalchemy.org (2.0) • sqlmodel.tiangolo.com • alembic.sqlalchemy.org • www.uvicorn.org.',
  },
  sections: khung('fa', [
    ['Section 0 — Why FastAPI', 'Mục 0 — Vì sao FastAPI', 'FastAPI khác Flask/Django ở đâu, và vì sao nó là lựa chọn mặc định cho backend AI.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What FastAPI is, ASGI vs WSGI, and why AI startups pick it', 'Bắt đầu tại đây (1/2) — FastAPI là gì, ASGI khác WSGI ra sao, vì sao startup AI chọn nó', 'Sebastián Ramírez 2018, dựa trên Starlette + Pydantic · ASGI (bất đồng bộ) vs WSGI (Flask/Django cổ điển) · Docs OpenAPI tự sinh · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — APIs without validation, and how to study this course', 'Bắt đầu tại đây (2/2) — API không validate dữ liệu, và cách học khoá này', 'Tình huống: request sai kiểu làm sập service ở tầng dưới · Lộ trình: routing → data → auth → AI streaming → deploy · Đối chiếu nhanh với khoá Node.js/Express đã học'],
      ['cai-dat', 'Installing FastAPI and running your first server', 'Cài đặt FastAPI và chạy server đầu tiên', 'uv add fastapi "uvicorn[standard]" · uvicorn main:app --reload · Trang /docs tự sinh (Swagger UI)'],
      ['cau-truc-du-an', 'Project structure for a real API', 'Cấu trúc dự án cho một API thật', 'Tách routers/models/schemas/services · APIRouter và include_router · Nơi đặt cấu hình và biến môi trường'],
    ]],
    ['Chapter 1 — Routing and Pydantic basics', 'Chương 1 — Routing và Pydantic căn bản', 'Path, query, body param — và validate tự động.', [
      ['path-query', 'Path and query parameters', 'Tham số path và query', '@app.get với kiểu param tự validate · Query optional với giá trị mặc định · Enum cho tham số giới hạn giá trị'],
      ['pydantic-model', 'Request bodies with Pydantic models', 'Body request với Pydantic model', 'BaseModel định nghĩa schema · Validate lồng nhau · Lỗi 422 tự động khi sai kiểu'],
      ['response-model', 'Response models and serialization', 'Response model và serialize dữ liệu', 'response_model lọc field trả về · model_config và alias · Trả danh sách và phân trang cơ bản'],
      ['http-status', 'Status codes and raising HTTPException', 'Mã trạng thái HTTP và HTTPException', 'status_code trên route · raise HTTPException(404, …) · Chuẩn hoá response lỗi'],
    ]],
    ['Chapter 2 — Pydantic v2 in depth', 'Chương 2 — Pydantic v2 đào sâu', 'Validate, transform và serialize dữ liệu chính xác.', [
      ['validator', 'Field and model validators', 'Field validator và model validator', '@field_validator · @model_validator cho logic liên trường · Validate trước/sau khi Pydantic parse'],
      ['kieu-nang-cao', 'Advanced types: Optional, Union, constrained fields', 'Kiểu nâng cao: Optional, Union, trường có ràng buộc', 'Field(gt=, max_length=…) · Union và discriminated union · datetime, UUID, EmailStr'],
      ['settings', 'Settings management with pydantic-settings', 'Quản lý cấu hình với pydantic-settings', 'BaseSettings đọc từ biến môi trường · .env cho local, biến thật cho production · Cache settings bằng lru_cache'],
      ['serialize-json', 'Serialization: model_dump, aliases, computed fields', 'Serialize: model_dump, alias, trường tính toán', 'model_dump(mode="json") · Alias cho camelCase ở frontend · @computed_field'],
    ]],
    ['Chapter 3 — Dependency injection', 'Chương 3 — Dependency Injection', 'Depends() và cách chia sẻ logic không lặp code.', [
      ['depends-co-ban', 'Depends basics', 'Depends căn bản', 'Hàm dependency đơn giản · Depends lồng nhau · Dependency toàn cục ở cấp router/app'],
      ['db-session-dep', 'Injecting a database session', 'Tiêm session cơ sở dữ liệu', 'yield trong dependency để đóng session đúng lúc · Session theo từng request · Tránh session rò rỉ'],
      ['auth-dep', 'Auth as a dependency', 'Xác thực bằng dependency', 'get_current_user tái sử dụng ở mọi route cần đăng nhập · Depends có tham số (scope, quyền)'],
      ['dep-nang-cao', 'Class-based dependencies and dependency overrides', 'Dependency dạng class và ghi đè dependency khi test', 'Callable class làm dependency có cấu hình · app.dependency_overrides trong test'],
    ]],
    ['Chapter 4 — Database with SQLModel/SQLAlchemy', 'Chương 4 — Cơ sở dữ liệu với SQLModel/SQLAlchemy', 'PostgreSQL, migration, và quan hệ dữ liệu.', [
      ['sqlmodel-co-ban', 'SQLModel: one model for API and database', 'SQLModel: một model dùng chung cho API và database', 'SQLModel = Pydantic + SQLAlchemy · table=True cho model DB · So với việc tách riêng schema và ORM model'],
      ['sqlalchemy-async', 'Async SQLAlchemy 2.0 sessions', 'Session bất đồng bộ với SQLAlchemy 2.0', 'create_async_engine · AsyncSession · select() kiểu 2.0 thay vì Query cũ'],
      ['quan-he', 'Relationships and queries', 'Quan hệ dữ liệu và truy vấn', 'ForeignKey và Relationship · N+1 query và cách tránh (selectinload) · Transaction cơ bản'],
      ['alembic', 'Migrations with Alembic', 'Migration với Alembic', 'alembic init, revision --autogenerate · Review migration trước khi chạy · alembic upgrade head trong CI/CD'],
    ]],
    ['Chapter 5 — Authentication', 'Chương 5 — Xác thực', 'OAuth2PasswordBearer và JWT theo chuẩn FastAPI.', [
      ['oauth2-form', 'OAuth2PasswordBearer and the login endpoint', 'OAuth2PasswordBearer và endpoint đăng nhập', 'OAuth2PasswordRequestForm · Băm mật khẩu với passlib/argon2 · Trả access token theo chuẩn OAuth2'],
      ['jwt-tao-doc', 'Creating and verifying JWTs', 'Tạo và xác minh JWT', 'python-jose hoặc pyjwt · Payload, thời hạn hết hạn · Verify trong dependency get_current_user'],
      ['phan-quyen', 'Scopes and role-based access', 'Scope và phân quyền theo vai trò', 'Security scopes trong OAuth2 · Kiểm vai trò trong dependency · 401 vs 403'],
      ['refresh-token', 'Refresh tokens and logout', 'Refresh token và đăng xuất', 'Access ngắn hạn, refresh dài hạn · Lưu refresh token ở đâu · Thu hồi token khi đăng xuất'],
    ]],
    ['Chapter 6 — Background tasks and jobs', 'Chương 6 — Tác vụ nền', 'Trả response ngay, xử lý nặng chạy sau.', [
      ['background-tasks', 'BackgroundTasks built into FastAPI', 'BackgroundTasks có sẵn của FastAPI', 'Thêm task sau khi trả response · Giới hạn: chạy trong cùng process, không bền nếu server restart · Khi nào đủ dùng'],
      ['khi-can-queue', 'When you need a real queue', 'Khi nào cần hàng đợi thật', 'Vấn đề của BackgroundTasks với việc nặng/dài · Giới thiệu Celery và RQ (khái niệm, không đào sâu) · Redis làm broker'],
      ['scheduled-job', 'Scheduled and periodic jobs', 'Tác vụ chạy định kỳ', 'APScheduler cho job lặp lại trong app · Cron job ở tầng hạ tầng thay vì trong code · Idempotency cho job chạy lại'],
      ['xu-ly-loi-job', 'Error handling in background work', 'Xử lý lỗi trong tác vụ nền', 'Lỗi trong background task không tự nổi lên request · Log và alert cho tác vụ nền · Retry có giới hạn'],
    ]],
    ['Chapter 7 — Streaming for AI responses', 'Chương 7 — Streaming cho phản hồi AI', 'Server-Sent Events và trả lời từng phần như một chat AI thật.', [
      ['streamingresponse', 'StreamingResponse basics', 'StreamingResponse căn bản', 'Generator/async generator làm nguồn stream · media_type text/event-stream · Khi nào dùng streaming, khi nào không cần'],
      ['sse-format', 'The SSE wire format', 'Định dạng dữ liệu SSE', 'data:, event:, id: · Gửi JSON trong từng sự kiện · Kết thúc stream đúng cách'],
      ['stream-llm', 'Streaming an LLM response through FastAPI', 'Stream phản hồi LLM qua FastAPI', 'Nhận stream từ API LLM rồi chuyển tiếp qua SSE · Không buffer toàn bộ trước khi gửi · Huỷ stream khi client ngắt kết nối'],
      ['frontend-sse', 'Consuming SSE from a React frontend', 'Nhận SSE từ frontend React', 'EventSource hoặc fetch + ReadableStream · Ghép các mẩu chữ vào UI dần dần · Xử lý lỗi giữa stream'],
    ]],
    ['Chapter 8 — Errors, middleware and CORS', 'Chương 8 — Lỗi, middleware và CORS', 'Một API nhất quán và an toàn để gọi từ trình duyệt.', [
      ['exception-handler', 'Custom exception handlers', 'Exception handler tuỳ biến', '@app.exception_handler · Định dạng lỗi nhất quán cho toàn API · Không lộ traceback ra production'],
      ['middleware', 'Writing middleware', 'Viết middleware', 'BaseHTTPMiddleware · Log request/response, đo thời gian xử lý · Thứ tự middleware chạy'],
      ['cors', 'CORS for a browser frontend', 'CORS cho frontend chạy trên trình duyệt', 'CORSMiddleware · allow_origins nên cụ thể, không nên "*" ở production · Preflight OPTIONS'],
      ['rate-limit', 'Basic rate limiting', 'Giới hạn tần suất cơ bản', 'slowapi hoặc middleware tự viết · Giới hạn theo IP/user · Trả 429 đúng chuẩn'],
    ]],
    ['Chapter 9 — Testing FastAPI', 'Chương 9 — Test FastAPI', 'pytest, TestClient và test bất đồng bộ thật.', [
      ['testclient', 'TestClient basics', 'TestClient căn bản', 'Gửi request không cần chạy server · Test route đồng bộ đơn giản · Fixture app dùng chung'],
      ['async-client', 'httpx.AsyncClient for async endpoint tests', 'httpx.AsyncClient để test endpoint bất đồng bộ', 'ASGITransport để test không mở cổng mạng · pytest-asyncio · Test luồng auth đầu-cuối'],
      ['override-dep', 'Overriding dependencies in tests', 'Ghi đè dependency khi test', 'app.dependency_overrides cho DB test · Database test riêng, không đụng dữ liệu thật · Dọn dữ liệu giữa các test'],
      ['test-stream', 'Testing streaming endpoints', 'Test endpoint streaming', 'Đọc từng chunk trong test · Kiểm định dạng SSE đúng · Test khi client ngắt giữa chừng'],
    ]],
    ['Chapter 10 — Docker and deployment', 'Chương 10 — Docker và deploy', 'Uvicorn/Gunicorn, Dockerfile, và đưa lên VPS.', [
      ['uvicorn-gunicorn', 'Uvicorn workers vs Gunicorn + Uvicorn', 'Uvicorn nhiều worker vs Gunicorn + Uvicorn', '--workers cho Uvicorn · Gunicorn làm process manager với UvicornWorker · Chọn số worker theo CPU'],
      ['dockerfile-fastapi', 'A production Dockerfile for FastAPI', 'Dockerfile production cho FastAPI', 'Base image python:3.13-slim · uv để cài dependency nhanh và có khoá phiên bản · Multi-stage build'],
      ['bien-moi-truong-prod', 'Environment variables and secrets in production', 'Biến môi trường và secret ở production', 'pydantic-settings đọc từ env thật · Không commit .env · Healthcheck endpoint cho orchestrator'],
      ['checkpoint-deploy', 'Deploying to a VPS behind Nginx', 'Deploy lên VPS phía sau Nginx', 'docker compose với FastAPI + Postgres + Nginx · Nginx reverse proxy giữ nguyên header cho SSE · Kiểm production bằng curl'],
    ]],
    ['Chapter 11 — Capstone: a streaming AI API', 'Chương 11 — Dự án cuối khoá: API AI có streaming', 'Ráp toàn bộ: routing, DB, auth, streaming, test, Docker.', [
      ['thiet-ke-api', 'Designing the API: chat endpoint + history', 'Thiết kế API: endpoint chat + lịch sử hội thoại', 'Schema Conversation/Message trong PostgreSQL · Endpoint tạo hội thoại và gửi tin nhắn · Xác thực ai được xem hội thoại nào'],
      ['stream-va-luu', 'Streaming the AI reply while saving it', 'Stream phản hồi AI trong lúc vẫn lưu lại', 'Vừa forward stream cho client, vừa gom lại để lưu DB sau khi xong · Xử lý khi client huỷ giữa chừng'],
      ['test-toan-dien', 'Testing the whole flow', 'Test toàn bộ luồng', 'Test tạo hội thoại, gửi tin, nhận stream (mock LLM) · Test phân quyền: user khác không đọc được hội thoại của người khác'],
      ['deploy-tong-ket', 'Deploying it and the final checklist', 'Deploy dự án và checklist cuối khoá', 'docker compose up production · Checklist năng lực cả khoá · Bước tiếp theo: khoá LLM Apps để đào sâu phần AI'],
    ]],
  ]),
};
