/**
 * Python — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm của 11 khoá khung
 * trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Nền cho các khoá FastAPI, RAG/Vector Search, AI Agents, Machine Learning, Deep Learning.
 * Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'languages', name: 'Ngôn ngữ lập trình', icon: 'Code2', sortOrder: 0 },
  course: {
    slug: 'python',
    title: 'Python for Backend & AI',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/python.png?v=1',
    shortDescription: 'Python from the ground up, aimed at backend and AI work: types, functions, modules, modern tooling with uv, typing, calling HTTP APIs, asyncio, testing with pytest, and just enough numpy/pandas to move data around.|||Python từ gốc, hướng thẳng tới backend và AI: kiểu dữ liệu, hàm, module, công cụ hiện đại uv, type hint, gọi HTTP API, asyncio, test với pytest, và vừa đủ numpy/pandas để xử lý dữ liệu.',
    description: 'Khoá Python nền tảng, không dạy Python "chung chung" mà dạy đúng phần cần cho backend và AI — hai hướng khoá FastAPI, RAG/Vector Search, AI Agents, Machine Learning và Deep Learning trên trang này đều dựng tiếp lên. Đi từ biến, kiểu dữ liệu, điều kiện, vòng lặp, hàm, module và package, cấu trúc dữ liệu (list/dict/set/tuple, comprehension), lập trình hướng đối tượng (class, dataclass), xử lý lỗi và context manager, môi trường ảo hiện đại với uv, type hint và công cụ kiểm tra (ruff, pyright), test với pytest, gọi HTTP API bằng requests/httpx, lập trình bất đồng bộ với asyncio, tới nền tảng numpy và pandas cho dữ liệu — kết thúc bằng một dự án nhỏ ráp mọi thứ lại.',
    whatYouLearn: 'Viết Python sạch, đúng kiểu, đúng quy ước (PEP 8); dùng list/dict/set/tuple và comprehension thành thạo; thiết kế class và dataclass hợp lý; xử lý lỗi và tài nguyên bằng try/except và context manager; quản lý môi trường và dependency bằng uv/venv; gõ type hint và để công cụ bắt lỗi trước khi chạy; viết test với pytest; gọi và xử lý dữ liệu từ REST API bằng httpx (đồng bộ lẫn bất đồng bộ); hiểu asyncio đủ để không bị timeout dây chuyền; và dùng numpy/pandas ở mức đọc và biến đổi dữ liệu.',
    requirements: 'Không cần biết Python trước — Chương 1 dựng lại từ đầu. Biết logic lập trình cơ bản (biến, vòng lặp, hàm) ở bất kỳ ngôn ngữ nào thì học nhanh hơn, nhưng không bắt buộc. Máy tính cài được Python 3.13 trở lên.',
    documentsNote: 'Tài liệu chính: docs.python.org (tài liệu chính thức, kể cả phần chuẩn PEP tại peps.python.org) • docs.astral.sh/uv cho quản lý môi trường • docs.pytest.org • www.python-httpx.org • numpy.org/doc • pandas.pydata.org/docs.',
  },
  sections: khung('py', [
    ['Section 0 — Why Python', 'Mục 0 — Vì sao Python', 'Python ra đời để làm gì, và vì sao nó là ngôn ngữ mặc định của AI.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What Python is, its history, and why it runs the AI world', 'Bắt đầu tại đây (1/2) — Python là gì, lịch sử ra đời, và vì sao nó chạy cả thế giới AI', 'Guido van Rossum 1991, triết lý "đọc được như văn xuôi" · Vì sao PyTorch, FastAPI, pandas đều chọn Python · Python 2 vs 3, và vì sao chỉ còn 3 · Câu hỏi phỏng vấn hay gặp về Python'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Scripts without structure, and a learning path that sticks', 'Bắt đầu tại đây (2/2) — Script không cấu trúc, và lộ trình học không nản', 'Script một file 500 dòng khó sửa vì sao · Tình huống thật: xử lý dữ liệu bằng tay vs bằng script · Lộ trình: nền tảng → tooling → HTTP/async → dữ liệu'],
      ['cai-dat', 'Installing Python and choosing an editor', 'Cài đặt Python và chọn trình soạn thảo', 'python.org vs pyenv vs uv python · REPL và python -i · VS Code + extension Python/Pylance'],
      ['script-dau-tien', 'Your first script: input, print, and running files', 'Script đầu tiên: input, print, và chạy file', 'python file.py · Biến và kiểu động · f-string · Shebang và chạy trực tiếp trên Linux/macOS'],
    ]],
    ['Chapter 1 — Types and control flow', 'Chương 1 — Kiểu dữ liệu và điều khiển luồng', 'Nền tảng cú pháp: biến, kiểu, điều kiện, vòng lặp.', [
      ['kieu-du-lieu', 'Numbers, strings and booleans', 'Số, chuỗi và boolean', 'int/float/str/bool · Toán tử số học và so sánh · Chuyển kiểu (casting) và bẫy thường gặp'],
      ['chuoi', 'Working with strings', 'Làm việc với chuỗi', 'Slicing · f-string định dạng · Method chuỗi hay dùng (strip, split, join)'],
      ['dieu-kien', 'Conditionals and truthiness', 'Điều kiện và "truthiness"', 'if/elif/else · Toán tử and/or/not · Những giá trị nào là falsy trong Python'],
      ['vong-lap', 'Loops: for, while, and comprehensions preview', 'Vòng lặp: for, while, và mở đầu comprehension', 'for trên iterable · range · break/continue · List comprehension một dòng đầu tiên'],
    ]],
    ['Chapter 2 — Functions, modules and packages', 'Chương 2 — Hàm, module và package', 'Tổ chức code thành đơn vị dùng lại được.', [
      ['ham', 'Defining functions and arguments', 'Định nghĩa hàm và tham số', 'def, return · Tham số mặc định · *args và **kwargs'],
      ['scope', 'Scope and default argument gotchas', 'Phạm vi biến và bẫy tham số mặc định', 'Local vs global · Bẫy kinh điển: mutable default argument · Closures cơ bản'],
      ['module', 'Modules and the import system', 'Module và hệ thống import', 'import vs from…import · __name__ == "__main__" · Import tương đối trong package'],
      ['package', 'Packages and project layout', 'Package và cấu trúc dự án', 'Thư mục có __init__.py vs package không cần nó (Python 3.3+) · src layout · pyproject.toml giới thiệu'],
    ]],
    ['Chapter 3 — Data structures and comprehensions', 'Chương 3 — Cấu trúc dữ liệu và comprehension', 'list, dict, set, tuple, và cách biến đổi chúng gọn gàng.', [
      ['list-tuple', 'Lists and tuples', 'List và tuple', 'Mutable vs immutable · Unpacking · Khi nào dùng tuple thay vì list'],
      ['dict-set', 'Dicts and sets', 'Dict và set', 'Tạo, truy cập, .get với default · Set để khử trùng lặp và giao/hợp/hiệu'],
      ['comprehension', 'Comprehensions for list, dict and set', 'Comprehension cho list, dict và set', 'Cú pháp chung · Điều kiện lọc trong comprehension · Khi nào comprehension làm code khó đọc hơn'],
      ['iterator-generator', 'Iterators and generators', 'Iterator và generator', 'yield và lazy evaluation · Generator expression · Xử lý dữ liệu lớn không load hết vào bộ nhớ'],
    ]],
    ['Chapter 4 — Object-oriented Python', 'Chương 4 — Lập trình hướng đối tượng trong Python', 'class, dataclass, và khi nào OOP thực sự cần thiết.', [
      ['class-co-ban', 'Classes, __init__ and methods', 'Class, __init__ và method', '__init__ và self · Thuộc tính instance vs class · Method thường vs @staticmethod vs @classmethod'],
      ['ke-thua', 'Inheritance and composition', 'Kế thừa và composition', 'super() · Khi nào kế thừa hợp lý, khi nào nên compose · Duck typing kiểu Python'],
      ['dataclass', 'Dataclasses for data-holding objects', 'Dataclass cho object chỉ chứa dữ liệu', '@dataclass giảm boilerplate · frozen=True cho bất biến · So sánh với Pydantic (dùng ở khoá FastAPI)'],
      ['dunder', 'Dunder methods and protocols', 'Dunder method và protocol', '__repr__, __eq__, __len__ · Protocol/typing.Protocol cho duck typing có kiểm kiểu'],
    ]],
    ['Chapter 5 — Errors, context managers and files', 'Chương 5 — Lỗi, context manager và file', 'Xử lý thất bại và tài nguyên đúng cách.', [
      ['exception', 'try/except and raising exceptions', 'try/except và tự ném exception', 'Bắt lỗi cụ thể, không bắt Exception trần · raise và tự định nghĩa exception · finally'],
      ['context-manager', 'Context managers and the with statement', 'Context manager và câu lệnh with', 'with mở/đóng tài nguyên tự động · Tự viết context manager bằng @contextmanager · Vì sao luôn dùng with cho file'],
      ['file-json', 'Reading files and working with JSON', 'Đọc file và làm việc với JSON', 'open() và mode đọc/ghi · json.load/dump · Encoding UTF-8 khi làm việc với tiếng Việt'],
      ['env-config', 'Environment variables and configuration', 'Biến môi trường và cấu hình', 'os.environ · python-dotenv cho .env · Không hardcode secret trong code'],
    ]],
    ['Chapter 6 — Modern tooling', 'Chương 6 — Công cụ hiện đại', 'Môi trường, dependency, type hint và linter — cách làm việc chuyên nghiệp.', [
      ['uv', 'Virtual environments and uv', 'Môi trường ảo và uv', 'Vì sao cần venv (cô lập dependency) · uv init/uv add/uv run · So với pip + venv truyền thống, và pyenv cho nhiều bản Python'],
      ['type-hint', 'Type hints', 'Type hint', 'Cú pháp def f(x: int) -> str · Optional, Union, list[int] · Type hint không ép kiểu lúc chạy — chỉ để công cụ kiểm'],
      ['pyright-ruff', 'Static checking with pyright and ruff', 'Kiểm tĩnh với pyright và ruff', 'pyright bắt lỗi kiểu trước khi chạy · ruff format + lint thay Black/Flake8/isort · Tích hợp VS Code'],
      ['cau-truc-du-an', 'Structuring a real Python project', 'Cấu trúc một dự án Python thật', 'pyproject.toml · src layout chuẩn · Script entrypoint và __main__.py'],
    ]],
    ['Chapter 7 — Testing with pytest', 'Chương 7 — Test với pytest', 'Viết và tổ chức test — nền cho mọi khoá sau.', [
      ['pytest-co-ban', 'pytest basics: functions and assert', 'pytest căn bản: hàm test và assert', 'Không cần class, không cần self.assertEqual · assert thuần · Chạy pytest và đọc output'],
      ['fixture', 'Fixtures and setup/teardown', 'Fixture và chuẩn bị/dọn dẹp', '@pytest.fixture · Fixture dùng chung qua conftest.py · Phạm vi fixture (function/module/session)'],
      ['parametrize', 'Parametrized tests', 'Test tham số hoá', '@pytest.mark.parametrize · Test nhiều trường hợp biên trong một hàm · Đặt tên test rõ nghĩa'],
      ['mock-pytest', 'Mocking with pytest and monkeypatch', 'Mock với pytest và monkeypatch', 'monkeypatch cho biến môi trường và hàm · unittest.mock.patch · Không mock thứ bạn không sở hữu'],
    ]],
    ['Chapter 8 — Calling HTTP APIs', 'Chương 8 — Gọi HTTP API', 'requests/httpx, và xử lý dữ liệu JSON từ bên ngoài.', [
      ['requests-httpx', 'requests vs httpx: making your first call', 'requests và httpx: gọi API đầu tiên', 'GET/POST cơ bản · Đọc JSON response · Header, query param, timeout'],
      ['loi-http', 'Handling errors and retries', 'Xử lý lỗi và thử lại', 'raise_for_status · Timeout và lỗi mạng · Retry có backoff, không retry vô hạn'],
      ['xac-thuc-api', 'Auth headers and API keys', 'Header xác thực và API key', 'Bearer token · Không hardcode key, đọc từ biến môi trường · Client dùng chung một session/client'],
      ['httpx-async', 'httpx.AsyncClient for concurrent calls', 'httpx.AsyncClient để gọi song song', 'Vì sao gọi tuần tự chậm khi có nhiều request · asyncio.gather cơ bản (đào sâu ở chương sau) · So sánh thời gian chạy thật'],
    ]],
    ['Chapter 9 — Async Python', 'Chương 9 — Python bất đồng bộ', 'asyncio đủ để hiểu FastAPI và các thư viện AI hiện đại.', [
      ['async-await', 'async def, await, and the event loop', 'async def, await, và event loop', 'Coroutine là gì · asyncio.run · Vì sao quên await là lỗi im lặng'],
      ['gather-task', 'Running things concurrently: gather and tasks', 'Chạy song song: gather và task', 'asyncio.gather · asyncio.create_task · Khi nào song song thực sự nhanh hơn'],
      ['sync-vs-async', 'When async helps and when it does not', 'Khi nào async có ích, khi nào không', 'I/O-bound vs CPU-bound · async không làm code chạy nhanh hơn cho việc tính toán nặng · Trộn sync/async an toàn'],
      ['loi-async', 'Common async bugs', 'Lỗi thường gặp khi viết code bất đồng bộ', 'Block event loop bằng code đồng bộ nặng · Exception trong task bị nuốt · Đóng client đúng lúc'],
    ]],
    ['Chapter 10 — Data basics: numpy and pandas', 'Chương 10 — Nền dữ liệu: numpy và pandas', 'Vừa đủ để đọc, biến đổi và tóm tắt dữ liệu cho AI.', [
      ['numpy-co-ban', 'numpy arrays and vectorized operations', 'Mảng numpy và phép toán vector hoá', 'ndarray vs list Python · Vì sao vector hoá nhanh hơn vòng lặp · Shape, broadcasting cơ bản'],
      ['pandas-doc-du-lieu', 'Loading and exploring data with pandas', 'Đọc và khám phá dữ liệu với pandas', 'DataFrame từ CSV/JSON · head, info, describe · Chọn cột, lọc dòng'],
      ['pandas-bien-doi', 'Cleaning and transforming data', 'Làm sạch và biến đổi dữ liệu', 'Xử lý giá trị thiếu (NaN) · groupby và tổng hợp · apply và khi nào tránh dùng nó'],
      ['sang-ai', 'Where this leads: FastAPI, RAG and ML/DL', 'Bước tiếp theo: FastAPI, RAG và ML/DL', 'numpy/pandas là nền cho khoá Machine Learning · httpx/asyncio là nền cho khoá LLM Apps và FastAPI · Trỏ các khoá tiếp theo'],
    ]],
    ['Chapter 11 — Capstone: a small async data tool', 'Chương 11 — Dự án cuối khoá: công cụ dữ liệu bất đồng bộ nhỏ', 'Ráp mọi phần lại: gọi API thật, xử lý bằng pandas, có test.', [
      ['thiet-ke-cong-cu', 'Planning a CLI tool that fetches and summarizes data', 'Lên kế hoạch một công cụ CLI lấy và tóm tắt dữ liệu', 'Chọn một API công khai làm nguồn dữ liệu · Định nghĩa input/output của CLI · Cấu trúc dự án với src layout'],
      ['xay-dung-goi-api', 'Fetching data concurrently with httpx + asyncio', 'Lấy dữ liệu song song bằng httpx + asyncio', 'Gọi nhiều endpoint cùng lúc · Xử lý lỗi từng phần không làm sập cả lô · Lưu kết quả thô ra JSON'],
      ['xu-ly-pandas', 'Processing and summarizing with pandas', 'Xử lý và tóm tắt bằng pandas', 'Đưa JSON vào DataFrame · Làm sạch và tính vài chỉ số tóm tắt · Xuất kết quả ra CSV'],
      ['test-va-tong-ket', 'Testing the tool and course wrap-up', 'Test công cụ và tổng kết khoá', 'Test phần fetch bằng mock, test phần xử lý bằng dữ liệu mẫu thật · Checklist năng lực cả khoá · Bước tiếp theo: FastAPI hoặc Machine Learning'],
    ]],
  ]),
};
