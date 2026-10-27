/**
 * FER202 · Chương 8 (Hooks) — LAB 8: Movie Management System using React Hooks.
 * ĐỀ MẪU "bản in" của Code Lab (đợt Academy 28/10/2026): đề MỚI viết theo DẠNG đề lab trường (không chép đề
 * thật) — cây thư mục, wireframe, mô hình dữ liệu, 8 chức năng có Requirements + hook bắt buộc + khoá
 * localStorage, thang điểm 10, demo, starter, bộ kiểm theo từng chức năng (nhom f1..f8).
 * Định dạng: content/codelab/README.md. Xuất JSON: node scripts/codelab-xuat-de.mjs --track fer202-practice
 * Kiểm bằng trình duyệt thật: npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track fer202-practice
 *
 * Dấu thay trong chuỗi code (doiDau): ´ ⇒ dấu huyền, @{ ⇒ ${.
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';

// ════════════════════════════════════════ LỜI GIẢI ════════════════════════════════════════
const DATA = `// src/datas/movies.js — dữ liệu mẫu (6 phim) + danh sách thể loại dùng chung
export const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Animation'];

const movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8, duration: 148, favorite: false },
  { id: 2, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0, duration: 152, favorite: false },
  { id: 3, title: 'Spirited Away', genre: 'Animation', year: 2001, rating: 8.6, duration: 125, favorite: false },
  { id: 4, title: 'The Grand Budapest Hotel', genre: 'Comedy', year: 2014, rating: 8.1, duration: 99, favorite: false },
  { id: 5, title: 'Parasite', genre: 'Drama', year: 2019, rating: 8.5, duration: 132, favorite: false },
  { id: 6, title: 'Mad Max: Fury Road', genre: 'Action', year: 2015, rating: 8.1, duration: 120, favorite: false },
];

export default movies;
`;

const INDEX = `// src/index.js — điểm vào: bọc App trong ThemeProvider để mọi component đọc được theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
`;

const HOOK = `// src/hooks/useLocalStorage.js — custom hook: state "nhớ" qua lần tải lại trang
import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  // Lazy initializer: chỉ đọc localStorage MỘT lần lúc mount, không phải mỗi lần render
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue; // JSON hỏng / storage bị chặn ⇒ dùng giá trị khởi đầu
    }
  });

  // Mỗi khi value đổi ⇒ ghi lại (JSON vì localStorage chỉ giữ chuỗi)
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
`;

const THEME = `// src/context/ThemeContext.js — Light/Dark mode dùng chung qua Context (không truyền props qua 3 tầng)
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light'); // nhớ lựa chọn qua lần tải lại
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
`;

const APP = `// src/App.js — giữ state chính; danh sách hiển thị là state SUY RA (useMemo), không lưu riêng
import { useMemo, useState } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import MovieForm from './components/MovieForm';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import initialMovies from './datas/movies';

export default function App() {
  const { theme } = useTheme();
  const [movies, setMovies] = useLocalStorage('movies', initialMovies);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [sortBy, setSortBy] = useState('none');
  const [selectedId, setSelectedId] = useState(null);

  // Lọc + tìm + sắp xếp: chỉ tính lại khi một trong 4 đầu vào đổi
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = movies.filter((m) => (genre === 'All' || m.genre === genre) && m.title.toLowerCase().includes(q));
    // sort trên BẢN SAO — sort() đổi mảng tại chỗ, không được đụng vào state
    if (sortBy === 'rating-desc') return [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'year-desc') return [...list].sort((a, b) => b.year - a.year);
    if (sortBy === 'title-asc') return [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [movies, search, genre, sortBy]);

  const addMovie = (movie) =>
    setMovies((list) => [...list, { ...movie, id: Math.max(0, ...list.map((m) => m.id)) + 1, favorite: false }]);

  const deleteMovie = (id) => {
    if (!window.confirm('Delete this movie?')) return;
    setMovies((list) => list.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const toggleFavorite = (id) =>
    setMovies((list) => list.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m)));

  const selected = movies.find((m) => m.id === selectedId) ?? null;
  const favorites = movies.filter((m) => m.favorite).length;

  return (
    <div className={´app theme-@{theme}´}>
      <Header shown={visible.length} total={movies.length} favorites={favorites} />
      <main className="layout">
        <section className="content">
          <Toolbar search={search} onSearch={setSearch} genre={genre} onGenre={setGenre} sortBy={sortBy} onSort={setSortBy} />
          <MovieList movies={visible} onDetail={setSelectedId} onDelete={deleteMovie} onToggleFavorite={toggleFavorite} />
        </section>
        <aside className="side">
          <MovieDetail movie={selected} onClose={() => setSelectedId(null)} />
          <MovieForm onAdd={addMovie} />
        </aside>
      </main>
    </div>
  );
}
`;

const HEADER = `// src/components/Header.js
import { useTheme } from '../context/ThemeContext';

export default function Header({ shown, total, favorites }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="header">
      <h1>🎬 Movie Manager</h1>
      <p id="movie-count">Showing {shown} of {total} movies</p>
      <p id="fav-count">Favorites: {favorites}</p>
      <button id="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
      </button>
    </header>
  );
}
`;

const TOOLBAR = `// src/components/Toolbar.js — ô tìm (tự focus), lọc thể loại, sắp xếp: đều là controlled component
import { useEffect, useRef } from 'react';
import { GENRES } from '../datas/movies';

export default function Toolbar({ search, onSearch, genre, onGenre, sortBy, onSort }) {
  const inputRef = useRef(null);

  // [] ⇒ chỉ focus MỘT lần sau lần render đầu (không có [] là giành focus sau mỗi lần gõ ô khác)
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="toolbar">
      <input
        id="search"
        ref={inputRef}
        type="search"
        placeholder="Search by title"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select id="genre-filter" value={genre} onChange={(e) => onGenre(e.target.value)}>
        <option value="All">All Genres</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <select id="sort" value={sortBy} onChange={(e) => onSort(e.target.value)}>
        <option value="none">Sort: default</option>
        <option value="rating-desc">Rating (high → low)</option>
        <option value="year-desc">Year (new → old)</option>
        <option value="title-asc">Title (A → Z)</option>
      </select>
    </div>
  );
}
`;

const LIST = `// src/components/MovieList.js
import MovieCard from './MovieCard';

export default function MovieList({ movies, onDetail, onDelete, onToggleFavorite }) {
  if (movies.length === 0) return <p className="empty">No movies found</p>;
  return (
    <div className="movie-grid">
      {movies.map((m) => (
        // key = id ổn định (KHÔNG dùng index: xoá/sắp xếp làm index đổi chủ)
        <MovieCard key={m.id} movie={m} onDetail={onDetail} onDelete={onDelete} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
`;

const CARD = `// src/components/MovieCard.js
export default function MovieCard({ movie, onDetail, onDelete, onToggleFavorite }) {
  return (
    <article className={´movie-card@{movie.favorite ? ' is-fav' : ''}´}>
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-meta">{movie.genre} · {movie.year}</p>
      <p className="movie-rating">⭐ {Number(movie.rating).toFixed(1)}</p>
      <div className="card-actions">
        <button type="button" className="btn-fav" aria-pressed={movie.favorite} onClick={() => onToggleFavorite(movie.id)}>
          {movie.favorite ? '★ Favorite' : '☆ Favorite'}
        </button>
        <button type="button" className="btn-detail" onClick={() => onDetail(movie.id)}>Details</button>
        <button type="button" className="btn-delete" onClick={() => onDelete(movie.id)}>Delete</button>
      </div>
    </article>
  );
}
`;

const DETAIL = `// src/components/MovieDetail.js
export default function MovieDetail({ movie, onClose }) {
  if (!movie) return null;
  return (
    <section id="movie-detail" className="panel">
      <h2>{movie.title}</h2>
      <dl>
        <dt>Genre</dt><dd>{movie.genre}</dd>
        <dt>Year</dt><dd>{movie.year}</dd>
        <dt>Duration</dt><dd>{movie.duration ? ´@{movie.duration} min´ : 'N/A'}</dd>
        <dt>Rating</dt><dd>{Number(movie.rating).toFixed(1)} / 10</dd>
      </dl>
      <button id="close-detail" type="button" onClick={onClose}>Close</button>
    </section>
  );
}
`;

const FORM = `// src/components/MovieForm.js — form controlled + kiểm hợp lệ trước khi thêm
import { useState } from 'react';
import { GENRES } from '../datas/movies';

const EMPTY = { title: '', genre: 'Action', year: '', rating: '', duration: '' };

export default function MovieForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault(); // không có dòng này: trình duyệt tải lại trang, mất hết state
    const title = form.title.trim();
    const year = Number(form.year);
    const rating = Number(form.rating);
    if (!title) return setError('Title is required');
    if (!Number.isInteger(year) || year < 1900 || year > 2030) return setError('Year must be between 1900 and 2030');
    if (form.rating === '' || Number.isNaN(rating) || rating < 0 || rating > 10) return setError('Rating must be between 0 and 10');
    onAdd({ title, genre: form.genre, year, rating, duration: form.duration ? Number(form.duration) : null });
    setForm(EMPTY);
    setError('');
  };

  return (
    <form id="movie-form" className="panel" onSubmit={handleSubmit} noValidate>
      <h2>Add a movie</h2>
      <label>Title <input id="title" name="title" value={form.title} onChange={update} /></label>
      <label>Genre
        <select id="genre" name="genre" value={form.genre} onChange={update}>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <label>Year <input id="year" name="year" type="number" value={form.year} onChange={update} /></label>
      <label>Rating <input id="rating" name="rating" type="number" step="0.1" value={form.rating} onChange={update} /></label>
      <label>Duration (min) <input id="duration" name="duration" type="number" value={form.duration} onChange={update} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit">Add movie</button>
    </form>
  );
}
`;

const CSS = `/* src/index.css — giao diện gọn, có Light/Dark theo lớp của .app */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.app { min-height: 100vh; padding: 20px; background: #f8fafc; color: #0f172a; }
.app.theme-dark { background: #0f172a; color: #e2e8f0; }
.header { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; margin-bottom: 16px; }
.header h1 { margin: 0; font-size: 24px; }
.header p { margin: 0; font-size: 14px; opacity: .8; }
.header button { margin-left: auto; }
button { padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; }
.theme-dark button { background: #1e293b; color: #e2e8f0; border-color: #334155; }
.layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
@media (max-width: 760px) { .layout { grid-template-columns: 1fr; } }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.toolbar input { flex: 1; min-width: 180px; }
input, select { padding: 7px 9px; border-radius: 8px; border: 1px solid #cbd5e1; font: inherit; }
.theme-dark input, .theme-dark select { background: #1e293b; color: #e2e8f0; border-color: #334155; }
.movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.movie-card { padding: 14px; border-radius: 12px; background: #fff; border: 1px solid #e2e8f0; }
.theme-dark .movie-card { background: #1e293b; border-color: #334155; }
.movie-card.is-fav { border-color: #f59e0b; box-shadow: 0 0 0 2px #fde68a; }
.movie-title { margin: 0 0 4px; font-size: 16px; }
.movie-meta, .movie-rating { margin: 2px 0; font-size: 13px; opacity: .85; }
.card-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.empty { padding: 24px; text-align: center; opacity: .7; }
.panel { padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; margin-bottom: 14px; }
.theme-dark .panel { background: #1e293b; border-color: #334155; }
.panel h2 { margin: 0 0 10px; font-size: 17px; }
.panel label { display: grid; gap: 4px; font-size: 13px; margin-bottom: 8px; }
.panel dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 14px; }
.panel dd { margin: 0; }
.error { color: #dc2626; font-size: 13px; margin: 4px 0 8px; }
`;

// ════════════════════════════════════════ CODE KHỞI ĐẦU ════════════════════════════════════════
const S_APP = `// src/App.js — STARTER. Hoàn thành theo đề: state phim (useLocalStorage), tìm/lọc/sắp xếp (useMemo),
// chi tiết, thêm, xoá, yêu thích. Đừng đổi id/class mà đề yêu cầu — máy chấm dựa vào chúng.
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import MovieForm from './components/MovieForm';
import initialMovies from './datas/movies';

export default function App() {
  const movies = initialMovies; // TODO: state + Local Storage (key "movies")

  return (
    <div className="app theme-light">
      <Header shown={movies.length} total={movies.length} favorites={0} />
      <main className="layout">
        <section className="content">
          <Toolbar />
          <MovieList movies={movies} onDetail={() => {}} onDelete={() => {}} onToggleFavorite={() => {}} />
        </section>
        <aside className="side">
          <MovieDetail movie={null} onClose={() => {}} />
          <MovieForm onAdd={() => {}} />
        </aside>
      </main>
    </div>
  );
}
`;

const S_HOOK = `// src/hooks/useLocalStorage.js — STARTER
import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  // TODO: đọc localStorage[key] lúc khởi tạo (lazy initializer) và ghi lại mỗi khi value đổi (useEffect)
  return useState(initialValue);
}
`;

const S_THEME = `// src/context/ThemeContext.js — STARTER
import { createContext, useContext } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // TODO: theme lưu Local Storage (key "theme"), toggleTheme đổi light ⇄ dark
  return <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
`;

const S_HEADER = `// src/components/Header.js — STARTER
export default function Header({ shown, total, favorites }) {
  return (
    <header className="header">
      <h1>🎬 Movie Manager</h1>
      <p id="movie-count">Showing {shown} of {total} movies</p>
      <p id="fav-count">Favorites: {favorites}</p>
      <button id="theme-toggle" type="button">🌙 Dark mode</button>
    </header>
  );
}
`;

const S_TOOLBAR = `// src/components/Toolbar.js — STARTER: các ô đã có id đúng, chưa nối state, chưa tự focus
import { GENRES } from '../datas/movies';

export default function Toolbar() {
  return (
    <div className="toolbar">
      <input id="search" type="search" placeholder="Search by title" />
      <select id="genre-filter">
        <option value="All">All Genres</option>
        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <select id="sort">
        <option value="none">Sort: default</option>
        <option value="rating-desc">Rating (high → low)</option>
        <option value="year-desc">Year (new → old)</option>
        <option value="title-asc">Title (A → Z)</option>
      </select>
    </div>
  );
}
`;

const S_DETAIL = `// src/components/MovieDetail.js — STARTER
export default function MovieDetail({ movie, onClose }) {
  // TODO: hiện #movie-detail với title, genre, year, duration ("148 min"), rating + nút #close-detail
  return null;
}
`;

const S_FORM = `// src/components/MovieForm.js — STARTER: chưa controlled, chưa kiểm hợp lệ, chưa chặn tải lại trang
import { GENRES } from '../datas/movies';

export default function MovieForm({ onAdd }) {
  return (
    <form id="movie-form" className="panel">
      <h2>Add a movie</h2>
      <label>Title <input id="title" name="title" /></label>
      <label>Genre
        <select id="genre" name="genre">
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <label>Year <input id="year" name="year" type="number" /></label>
      <label>Rating <input id="rating" name="rating" type="number" step="0.1" /></label>
      <label>Duration (min) <input id="duration" name="duration" type="number" /></label>
      <button type="submit">Add movie</button>
    </form>
  );
}
`;

const LOI_GIAI = {
  'src/index.js': INDEX, 'src/App.js': APP, 'src/index.css': CSS,
  'src/components/Header.js': HEADER, 'src/components/Toolbar.js': TOOLBAR, 'src/components/MovieList.js': LIST,
  'src/components/MovieCard.js': CARD, 'src/components/MovieDetail.js': DETAIL, 'src/components/MovieForm.js': FORM,
  'src/context/ThemeContext.js': THEME, 'src/hooks/useLocalStorage.js': HOOK, 'src/datas/movies.js': DATA,
};
const KHOI_DAU = {
  'src/index.js': INDEX, 'src/App.js': S_APP, 'src/index.css': CSS,
  'src/components/Header.js': S_HEADER, 'src/components/Toolbar.js': S_TOOLBAR, 'src/components/MovieList.js': LIST,
  'src/components/MovieCard.js': CARD, 'src/components/MovieDetail.js': S_DETAIL, 'src/components/MovieForm.js': S_FORM,
  'src/context/ThemeContext.js': S_THEME, 'src/hooks/useLocalStorage.js': S_HOOK, 'src/datas/movies.js': DATA,
};

// ════════════════════════════════════════ BỘ KIỂM ════════════════════════════════════════
const TITLES = ['Inception', 'The Dark Knight', 'Spirited Away', 'The Grand Budapest Hotel', 'Parasite', 'Mad Max: Fury Road'];
const THEM_DUNE = [
  { hanhDong: 'nhap', selector: '#title', giaTri: 'Dune' },
  { hanhDong: 'doi', selector: '#genre', giaTri: 'Sci-Fi' },
  { hanhDong: 'nhap', selector: '#year', giaTri: '2021' },
  { hanhDong: 'nhap', selector: '#rating', giaTri: '8' },
  { hanhDong: 'gui', selector: '#movie-form' },
];
const KIEM = [
  // f1 — Display
  { nhom: 'f1', moTa: '6 movie cards are rendered on first load', kiem: 'so-luong', selector: '.movie-card', giaTri: 6 },
  { nhom: 'f1', moTa: 'Cards show titles in data order', kiem: 'danh-sach-text', selector: '.movie-card .movie-title', mongDoi: TITLES },
  { nhom: 'f1', moTa: '#movie-count reads "Showing 6 of 6 movies"', kiem: 'text', selector: '#movie-count', khop: 'Showing\\s+6\\s+of\\s+6' },
  { nhom: 'f1', moTa: 'Custom hook useLocalStorage reads and writes localStorage', kiem: 'ma-nguon', tep: 'src/hooks/useLocalStorage.js', khop: 'localStorage\\.getItem[\\s\\S]*localStorage\\.setItem' },
  // f2 — Search
  { nhom: 'f2', moTa: 'Search box #search is auto-focused on load', kiem: 'focus', selector: '#search' },
  { nhom: 'f2', moTa: 'Typing "the" shows 2 movies', kiem: 'so-luong', selector: '.movie-card', giaTri: 2, truoc: [{ hanhDong: 'nhap', selector: '#search', giaTri: 'the' }] },
  { nhom: 'f2', moTa: 'No match ⇒ "No movies found"', kiem: 'text', selector: '.empty', khop: 'No movies found', truoc: [{ hanhDong: 'nhap', selector: '#search', giaTri: 'zzz' }] },
  { nhom: 'f2', an: true, moTa: 'Search is case-insensitive', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: ['Inception'], truoc: [{ hanhDong: 'nhap', selector: '#search', giaTri: 'INCEPTION' }] },
  // f3 — Filter
  { nhom: 'f3', moTa: 'Genre "Action" ⇒ 2 movies, count updates', kiem: 'text', selector: '#movie-count', khop: 'Showing\\s+2\\s+of\\s+6', truoc: [{ hanhDong: 'doi', selector: '#genre-filter', giaTri: 'Action' }] },
  { nhom: 'f3', moTa: 'Filtered/sorted list is memoized with useMemo', kiem: 'ma-nguon', khop: '\\buseMemo\\s*\\(' },
  { nhom: 'f3', an: true, moTa: 'Filter + search combine', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: ['Mad Max: Fury Road'], truoc: [{ hanhDong: 'doi', selector: '#genre-filter', giaTri: 'Action' }, { hanhDong: 'nhap', selector: '#search', giaTri: 'max' }] },
  // f4 — Sort
  { nhom: 'f4', moTa: 'Sort by rating (high → low)', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: ['The Dark Knight', 'Inception', 'Spirited Away', 'Parasite', 'The Grand Budapest Hotel', 'Mad Max: Fury Road'], truoc: [{ hanhDong: 'doi', selector: '#sort', giaTri: 'rating-desc' }] },
  { nhom: 'f4', moTa: 'Sort by title (A → Z)', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: ['Inception', 'Mad Max: Fury Road', 'Parasite', 'Spirited Away', 'The Dark Knight', 'The Grand Budapest Hotel'], truoc: [{ hanhDong: 'doi', selector: '#sort', giaTri: 'title-asc' }] },
  { nhom: 'f4', an: true, moTa: 'Sort by year (new → old)', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: ['Parasite', 'Mad Max: Fury Road', 'The Grand Budapest Hotel', 'Inception', 'The Dark Knight', 'Spirited Away'], truoc: [{ hanhDong: 'doi', selector: '#sort', giaTri: 'year-desc' }] },
  // f5 — Detail
  { nhom: 'f5', moTa: '"Details" opens #movie-detail with title and "148 min"', kiem: 'text', selector: '#movie-detail', khop: 'Inception[\\s\\S]*148 min', truoc: [{ hanhDong: 'click', selector: '.btn-detail' }] },
  { nhom: 'f5', moTa: '#close-detail closes the panel', kiem: 'khong-ton-tai', selector: '#movie-detail', truoc: [{ hanhDong: 'click', selector: '.btn-detail' }, { hanhDong: 'click', selector: '#close-detail' }] },
  // f6 — Add
  { nhom: 'f6', moTa: 'Adding "Dune" appends a 7th card at the end', kiem: 'danh-sach-text', selector: '.movie-title', mongDoi: [...TITLES, 'Dune'], truoc: THEM_DUNE },
  { nhom: 'f6', moTa: 'Submitting does not reload the page', kiem: 'khong-tai-lai', truoc: THEM_DUNE },
  { nhom: 'f6', moTa: 'Empty title ⇒ "Title is required", nothing added', kiem: 'text', selector: '.error', khop: 'Title is required', truoc: [{ hanhDong: 'gui', selector: '#movie-form' }] },
  { nhom: 'f6', moTa: 'Movies are saved to localStorage key "movies"', kiem: 'kho-cuc-bo', khoa: 'movies', doDai: 7, truoc: THEM_DUNE },
  { nhom: 'f6', an: true, moTa: 'Rating 11 is rejected', kiem: 'text', selector: '.error', khop: 'rating', truoc: [{ hanhDong: 'nhap', selector: '#title', giaTri: 'X' }, { hanhDong: 'nhap', selector: '#year', giaTri: '2020' }, { hanhDong: 'nhap', selector: '#rating', giaTri: '11' }, { hanhDong: 'gui', selector: '#movie-form' }] },
  { nhom: 'f6', an: true, moTa: 'Added movie survives a page reload', kiem: 'so-luong', selector: '.movie-card', giaTri: 7, truoc: [...THEM_DUNE, { hanhDong: 'tai-lai' }] },
  // f7 — Delete + favorite
  { nhom: 'f7', moTa: 'Favorite toggles ★ and "Favorites: 1"', kiem: 'text', selector: '#fav-count', khop: 'Favorites:\\s*1', truoc: [{ hanhDong: 'click', selector: '.btn-fav' }] },
  { nhom: 'f7', moTa: 'Favorite card gets class is-fav', kiem: 'so-luong', selector: '.movie-card.is-fav', giaTri: 1, truoc: [{ hanhDong: 'click', selector: '.btn-fav' }] },
  { nhom: 'f7', moTa: 'Delete (after confirm) removes the card', kiem: 'so-luong', selector: '.movie-card', giaTri: 5, truoc: [{ hanhDong: 'click', selector: '.btn-delete' }] },
  { nhom: 'f7', an: true, moTa: 'Delete is persisted to localStorage', kiem: 'kho-cuc-bo', khoa: 'movies', doDai: 5, truoc: [{ hanhDong: 'click', selector: '.btn-delete' }] },
  { nhom: 'f7', an: true, moTa: 'Favorite survives a page reload', kiem: 'so-luong', selector: '.movie-card.is-fav', giaTri: 1, truoc: [{ hanhDong: 'click', selector: '.btn-fav' }, { hanhDong: 'tai-lai' }] },
  // f8 — Theme
  { nhom: 'f8', moTa: 'App starts in light mode (.app.theme-light)', kiem: 'ton-tai', selector: '.app.theme-light' },
  { nhom: 'f8', moTa: '#theme-toggle switches to dark mode', kiem: 'ton-tai', selector: '.app.theme-dark', truoc: [{ hanhDong: 'click', selector: '#theme-toggle' }] },
  { nhom: 'f8', moTa: 'Theme is shared with useContext', kiem: 'ma-nguon', khop: '\\buseContext\\s*\\(' },
  { nhom: 'f8', an: true, moTa: 'Theme choice is saved (localStorage "theme")', kiem: 'kho-cuc-bo', khoa: 'theme', khop: 'dark', truoc: [{ hanhDong: 'click', selector: '#theme-toggle' }] },
];

// ════════════════════════════════════════ ĐỀ (bản in) ════════════════════════════════════════
const BAN_IN = {
  tieuDe: { en: 'LAB 8: Movie Management System using React Hooks', vi: 'LAB 8: Hệ thống quản lý phim dùng React Hooks' },
  phu: {
    en: 'FER202 · Chapter 8 — Hooks · Suggested time: 120 minutes · Total: 10 marks',
    vi: 'FER202 · Chương 8 — Hooks · Thời gian gợi ý: 120 phút · Tổng: 10 điểm',
  },
  moTa: {
    en: '<p>Build a ReactJS application that lets a user manage a personal movie watchlist: browse the list, search by title, filter by genre, sort, open a movie\'s details, add new movies, delete movies and mark favourites. All data must <b>persist across page reloads</b> with Local Storage, and the app supports <b>Light/Dark mode</b> shared through React Context.</p>',
    vi: '<p>Xây dựng ứng dụng ReactJS cho người dùng quản lý danh sách phim cá nhân: xem danh sách, tìm theo tên, lọc theo thể loại, sắp xếp, xem chi tiết một phim, thêm phim mới, xoá phim và đánh dấu yêu thích. Mọi dữ liệu phải <b>còn nguyên sau khi tải lại trang</b> nhờ Local Storage, và ứng dụng có <b>chế độ Sáng/Tối</b> dùng chung qua React Context.</p>',
  },
  chucNangChinh: [
    { en: 'Display, search, filter and sort the movie list.', vi: 'Hiển thị, tìm, lọc và sắp xếp danh sách phim.' },
    { en: 'View details · add · delete · favourite a movie.', vi: 'Xem chi tiết · thêm · xoá · yêu thích một phim.' },
    { en: 'Persist movies and the chosen theme in Local Storage.', vi: 'Lưu danh sách phim và theme đã chọn vào Local Storage.' },
  ],
  yeuCauChung: [
    { en: 'Function components + Hooks only (no class components).', vi: 'Chỉ dùng function component + Hooks (không class component).' },
    { en: 'All form inputs are <b>controlled components</b>; the form must not reload the page.', vi: 'Mọi ô nhập là <b>controlled component</b>; gửi form không được tải lại trang.' },
    { en: 'Never mutate state directly (no <code>push</code>, no in-place <code>sort</code> on state arrays).', vi: 'Không sửa state trực tiếp (không <code>push</code>, không <code>sort</code> tại chỗ trên mảng state).' },
    { en: 'Keep the ids / class names in section 6 exactly — the auto-grader uses them.', vi: 'Giữ ĐÚNG id / class ở mục 6 — máy chấm dựa vào chúng.' },
  ],
  cayThuMuc: `
src/
├── components/
│   ├── Header.js          # title, counters, Light/Dark button
│   ├── Toolbar.js         # search · genre filter · sort
│   ├── MovieList.js
│   ├── MovieCard.js
│   ├── MovieDetail.js
│   └── MovieForm.js
├── context/
│   └── ThemeContext.js    # ThemeProvider + useTheme()
├── hooks/
│   └── useLocalStorage.js # custom hook
├── datas/
│   └── movies.js          # 6 sample movies + GENRES
├── App.js
├── index.css
└── index.js`,
  wireframe: `
+---------------------------------------------------------------------------+
| Movie Manager    Showing 6 of 6 movies    Favorites: 0       [Dark mode]  |
+-----------------------------------------------+---------------------------+
| [Search by title    ] [All Genres v] [Sort v] | +- Inception -----------+ |
| +-------------+ +-------------+ +-----------+ | | Genre     Sci-Fi      | |
| | Inception   | | The Dark    | | Spirited  | | | Year      2010        | |
| | Sci-Fi 2010 | | Knight      | | Away      | | | Duration  148 min     | |
| | * 8.8       | | Action 2008 | | ...       | | | Rating    8.8 / 10    | |
| | [Fav][Det.] | | * 9.0       | |           | | |             [Close]   | |
| | [Delete]    | | ...         | |           | | +-----------------------+ |
| +-------------+ +-------------+ +-----------+ | +- Add a movie ---------+ |
|                                               | | Title [            ]  | |
|                                               | | Genre [Action v]      | |
|                                               | | Year [    ] Rating [ ]| |
|                                               | |          [Add movie]  | |
+-----------------------------------------------+---------------------------+`,
  moHinh: {
    ten: 'Movie',
    truong: [
      ['id', 'number', { en: 'unique; new id = max(id) + 1', vi: 'duy nhất; id mới = max(id) + 1' }],
      ['title', 'string', { en: 'required, trimmed', vi: 'bắt buộc, bỏ khoảng trắng đầu/cuối' }],
      ['genre', "'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Animation'", { en: 'from GENRES', vi: 'lấy từ GENRES' }],
      ['year', 'number', { en: 'integer 1900–2030', vi: 'số nguyên 1900–2030' }],
      ['rating', 'number', { en: '0–10 (one decimal)', vi: '0–10 (một chữ số thập phân)' }],
      ['duration', 'number | null', { en: 'minutes; optional', vi: 'phút; có thể bỏ trống' }],
      ['favorite', 'boolean', { en: 'false for new movies', vi: 'phim mới: false' }],
    ],
  },
  duLieuMau: `
// src/datas/movies.js (given) — favorite: false for all
{ id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8, duration: 148 }
{ id: 2, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0, duration: 152 }
{ id: 3, title: 'Spirited Away', genre: 'Animation', year: 2001, rating: 8.6, duration: 125 }
{ id: 4, title: 'The Grand Budapest Hotel', genre: 'Comedy', year: 2014, rating: 8.1, duration: 99 }
{ id: 5, title: 'Parasite', genre: 'Drama', year: 2019, rating: 8.5, duration: 132 }
{ id: 6, title: 'Mad Max: Fury Road', genre: 'Action', year: 2015, rating: 8.1, duration: 120 }`,
  chucNang: [
    {
      ten: { en: 'Display the movie list', vi: 'Hiển thị danh sách phim' }, diem: 1.5,
      moTa: { en: 'On first load show every movie as a card, in data order.', vi: 'Lần tải đầu, mỗi phim là một thẻ, đúng thứ tự dữ liệu.' },
      yeuCau: [
        { en: 'Each card <code>.movie-card</code> shows <code>.movie-title</code>, genre · year and rating.', vi: 'Mỗi thẻ <code>.movie-card</code> có <code>.movie-title</code>, thể loại · năm và điểm.' },
        { en: '<code>#movie-count</code> reads <code>Showing X of Y movies</code> (X = currently shown, Y = all).', vi: '<code>#movie-count</code> ghi <code>Showing X of Y movies</code> (X = đang hiện, Y = tổng).' },
        { en: 'The movie array lives in a custom hook <code>useLocalStorage(key, initialValue)</code> (lazy initializer + <code>useEffect</code> to write).', vi: 'Mảng phim nằm trong custom hook <code>useLocalStorage(key, initialValue)</code> (lazy initializer + <code>useEffect</code> để ghi).' },
        { en: 'Use a stable <code>key</code> (the movie id), never the array index.', vi: 'Dùng <code>key</code> ổn định (id phim), không dùng index.' },
      ],
      hook: ['useState', 'useEffect', 'custom hook'], khoa: 'movies',
    },
    {
      ten: { en: 'Search by title', vi: 'Tìm theo tên' }, diem: 1,
      yeuCau: [
        { en: 'Input <code>#search</code> is <b>auto-focused</b> when the page loads.', vi: 'Ô <code>#search</code> <b>tự focus</b> khi trang tải xong.' },
        { en: 'Case-insensitive "contains" match on the title; updates as you type.', vi: 'Khớp "chứa" không phân biệt hoa/thường; cập nhật ngay khi gõ.' },
        { en: 'No result ⇒ show <code>.empty</code> with the text <code>No movies found</code>.', vi: 'Không có kết quả ⇒ hiện <code>.empty</code> với chữ <code>No movies found</code>.' },
      ],
      hook: ['useRef', 'useEffect'],
      viDu: { en: 'Type "the" ⇒ The Dark Knight, The Grand Budapest Hotel (Showing 2 of 6)', vi: 'Gõ "the" ⇒ The Dark Knight, The Grand Budapest Hotel (Showing 2 of 6)' },
    },
    {
      ten: { en: 'Filter by genre', vi: 'Lọc theo thể loại' }, diem: 1,
      yeuCau: [
        { en: '<code>#genre-filter</code>: "All Genres" (value <code>All</code>) + the five genres.', vi: '<code>#genre-filter</code>: "All Genres" (value <code>All</code>) + năm thể loại.' },
        { en: 'Filter and search work <b>together</b>.', vi: 'Lọc và tìm hoạt động <b>cùng lúc</b>.' },
        { en: 'The shown list is <b>derived</b> with <code>useMemo</code> — do not store it in a second state.', vi: 'Danh sách hiển thị là <b>giá trị suy ra</b> bằng <code>useMemo</code> — không lưu thành state thứ hai.' },
      ],
      hook: ['useMemo'],
      viDu: { en: 'All Genres: Showing 6 of 6  →  Action: Showing 2 of 6', vi: 'All Genres: Showing 6 of 6  →  Action: Showing 2 of 6' },
    },
    {
      ten: { en: 'Sort', vi: 'Sắp xếp' }, diem: 1,
      yeuCau: [
        { en: '<code>#sort</code> values: <code>none</code> (data order), <code>rating-desc</code>, <code>year-desc</code>, <code>title-asc</code>.', vi: '<code>#sort</code> có: <code>none</code> (thứ tự dữ liệu), <code>rating-desc</code>, <code>year-desc</code>, <code>title-asc</code>.' },
        { en: 'Equal ratings keep their original order (stable sort). Sort a <b>copy</b>, never the state array.', vi: 'Điểm bằng nhau giữ thứ tự gốc (sắp xếp ổn định). Sắp xếp trên <b>bản sao</b>, không phải mảng state.' },
      ],
      hook: ['useMemo'],
    },
    {
      ten: { en: 'Movie details', vi: 'Chi tiết phim' }, diem: 1,
      yeuCau: [
        { en: '<code>.btn-detail</code> on a card opens <code>#movie-detail</code>: title, genre, year, duration as <code>148 min</code>, rating.', vi: '<code>.btn-detail</code> trên thẻ mở <code>#movie-detail</code>: tên, thể loại, năm, thời lượng dạng <code>148 min</code>, điểm.' },
        { en: '<code>#close-detail</code> closes it (the panel is removed from the page).', vi: '<code>#close-detail</code> đóng lại (khung biến khỏi trang).' },
      ],
      hook: ['useState'],
    },
    {
      ten: { en: 'Add a movie', vi: 'Thêm phim' }, diem: 2,
      yeuCau: [
        { en: 'Form <code>#movie-form</code> with <code>#title</code>, <code>#genre</code>, <code>#year</code>, <code>#rating</code>, <code>#duration</code> — all controlled.', vi: 'Form <code>#movie-form</code> gồm <code>#title</code>, <code>#genre</code>, <code>#year</code>, <code>#rating</code>, <code>#duration</code> — tất cả controlled.' },
        { en: 'Validate: title required; year 1900–2030; rating 0–10. Show the message in <code>.error</code> (e.g. <code>Title is required</code>) and add nothing.', vi: 'Kiểm: bắt buộc tên; năm 1900–2030; điểm 0–10. Báo lỗi trong <code>.error</code> (vd <code>Title is required</code>) và không thêm gì.' },
        { en: 'A valid movie is appended at the end with <code>id = max(id) + 1</code>; the form resets; the page never reloads.', vi: 'Phim hợp lệ thêm vào cuối với <code>id = max(id) + 1</code>; form trống lại; trang không tải lại.' },
        { en: 'The list is saved to Local Storage and survives a reload.', vi: 'Danh sách được lưu Local Storage và còn sau khi tải lại.' },
      ],
      hook: ['useState', 'controlled form'], khoa: 'movies',
    },
    {
      ten: { en: 'Delete & favourite', vi: 'Xoá & yêu thích' }, diem: 1.5,
      yeuCau: [
        { en: '<code>.btn-delete</code> asks <code>window.confirm</code> first, then removes the movie.', vi: '<code>.btn-delete</code> hỏi <code>window.confirm</code> trước, rồi mới xoá.' },
        { en: '<code>.btn-fav</code> toggles ☆/★; a favourite card has class <code>is-fav</code>; header <code>#fav-count</code> reads <code>Favorites: N</code>.', vi: '<code>.btn-fav</code> bật/tắt ☆/★; thẻ yêu thích có class <code>is-fav</code>; <code>#fav-count</code> ghi <code>Favorites: N</code>.' },
        { en: 'Both changes are persisted.', vi: 'Cả hai thay đổi đều được lưu.' },
      ],
      hook: ['useState'], khoa: 'movies',
    },
    {
      ten: { en: 'Light / Dark mode', vi: 'Chế độ Sáng / Tối' }, diem: 1,
      yeuCau: [
        { en: '<code>ThemeContext</code> provides <code>{ theme, toggleTheme }</code>; components read it with <code>useContext</code> (via <code>useTheme()</code>).', vi: '<code>ThemeContext</code> cung cấp <code>{ theme, toggleTheme }</code>; component đọc bằng <code>useContext</code> (qua <code>useTheme()</code>).' },
        { en: 'The root element is <code>.app.theme-light</code> or <code>.app.theme-dark</code>; <code>#theme-toggle</code> switches it.', vi: 'Phần tử gốc là <code>.app.theme-light</code> hoặc <code>.app.theme-dark</code>; <code>#theme-toggle</code> đổi qua lại.' },
        { en: 'The choice is remembered (Local Storage key <code>theme</code>).', vi: 'Lựa chọn được nhớ (khoá Local Storage <code>theme</code>).' },
      ],
      hook: ['useContext', 'createContext'], khoa: 'theme',
    },
  ],
  idBatBuoc: [
    ['#movie-count · #fav-count', { en: 'header counters', vi: 'bộ đếm ở header' }],
    ['#search · #genre-filter · #sort', { en: 'toolbar controls', vi: 'thanh công cụ' }],
    ['.movie-card · .movie-title · .is-fav', { en: 'one card per shown movie', vi: 'mỗi phim đang hiện một thẻ' }],
    ['.btn-fav · .btn-detail · .btn-delete', { en: 'card buttons', vi: 'nút trên thẻ' }],
    ['#movie-detail · #close-detail', { en: 'details panel', vi: 'khung chi tiết' }],
    ['#movie-form · #title · #genre · #year · #rating · #duration · .error', { en: 'add form + validation message', vi: 'form thêm + thông báo lỗi' }],
    ['.empty', { en: '"No movies found"', vi: '"No movies found"' }],
    ['.app.theme-light / .app.theme-dark · #theme-toggle', { en: 'theme', vi: 'theme' }],
  ],
  truDiem: [
    { en: 'Page reloads on submit (missing <code>e.preventDefault()</code>) — whole feature 6 = 0.', vi: 'Trang tải lại khi gửi form (thiếu <code>e.preventDefault()</code>) — chức năng 6 = 0.' },
    { en: 'Data lost after reload (no Local Storage) — features 1, 6, 7, 8 lose their persistence marks.', vi: 'Mất dữ liệu sau khi tải lại (không Local Storage) — mất điểm phần lưu của chức năng 1, 6, 7, 8.' },
    { en: 'Sorting the state array in place / mutating with <code>push</code> — list stops updating.', vi: 'Sắp xếp tại chỗ mảng state / sửa bằng <code>push</code> — danh sách không cập nhật.' },
    { en: 'Using the array index as <code>key</code> — wrong card removed/highlighted after delete or sort.', vi: 'Dùng index làm <code>key</code> — xoá/sắp xếp xong thẻ bị lẫn.' },
    { en: 'Renamed ids/classes — the grader cannot find the element.', vi: 'Đổi tên id/class — máy chấm không tìm thấy phần tử.' },
  ],
  nopBai: {
    en: 'Work directly in the editor (files on the right) or download the starter, build it with Vite/CRA on your machine and paste/import the files back. Press <b>Run</b> for the sample checks, <b>Submit</b> for the full grading (hidden checks included).',
    vi: 'Làm thẳng trong editor (các tệp bên phải) hoặc tải starter, chạy bằng Vite/CRA trên máy rồi dán/nhập lại tệp. Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ (kể cả kiểm ẩn).',
  },
};

export default doiDau({
  slug: 'fer202-8-lab-movie-hooks',
  ten: 'Lab 8 — Movie Management System (React Hooks)',
  khoa: 'front-end-web-development-with-react',
  baiHoc: 'fer202-8-3-slot9-hooks-slides',
  de: [
    {
      dangBai: 'lab',
      tieuDe: 'Lab 8 — Movie Management System using React Hooks',
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['useState', 'useEffect', 'useRef', 'useMemo', 'useContext', 'custom hook', 'controlled form', 'Local Storage'],
      tienQuyet: ['JSX & props', 'map/filter/sort', 'event handling'],
      the: ['fer202', 'lab', 'hooks', 'react'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'watchlist', vi: 'danh sách phim muốn xem' },
        { en: 'persist / persistence', vi: 'lưu bền (còn sau khi tải lại trang)' },
        { en: 'auto-focus', vi: 'tự đặt con trỏ vào ô nhập' },
        { en: 'controlled component', vi: 'ô nhập do state React điều khiển (value + onChange)' },
        { en: 'derived state', vi: 'giá trị suy ra từ state khác — tính lại, không lưu riêng' },
        { en: 'memoize (useMemo)', vi: 'nhớ kết quả tính, chỉ tính lại khi đầu vào đổi' },
        { en: 'lazy initializer', vi: 'hàm khởi tạo state chỉ chạy một lần (useState(() => …))' },
        { en: 'mutate', vi: 'sửa trực tiếp (đối tượng/mảng) — cấm với state' },
        { en: 'stable sort', vi: 'sắp xếp giữ thứ tự gốc của các phần tử bằng nhau' },
        { en: 'case-insensitive', vi: 'không phân biệt chữ hoa/thường' },
        { en: 'rubric', vi: 'thang điểm theo tiêu chí' },
      ],
      goiY: [
        'Bắt đầu từ hook: viết xong useLocalStorage (lazy initializer + useEffect ghi lại) rồi dùng nó cho cả "movies" lẫn "theme".',
        'Đừng tạo state "filteredMovies". Tính danh sách hiển thị bằng useMemo từ movies + search + genre + sortBy; sort trên [...list].',
        'Auto-focus: useRef gắn vào #search, useEffect(() => ref.current.focus(), []). Form: e.preventDefault() là dòng ĐẦU của handleSubmit.',
        'Thêm phim: setMovies(list => [...list, { ...movie, id: Math.max(0, ...list.map(m => m.id)) + 1, favorite: false }]).',
      ],
      loiHayGap: [
        'Đọc <code>localStorage</code> ngay trong thân component (<code>useState(JSON.parse(localStorage.getItem(…)))</code>) — chạy lại mỗi lần render; dùng lazy initializer <code>useState(() => …)</code>.',
        'Thêm phim bằng <code>movies.push(m); setMovies(movies)</code> — cùng một mảng ⇒ React không render lại.',
        'Quên <code>e.preventDefault()</code> — trang tải lại, mất state, máy chấm báo "trang tải lại".',
        '<code>movies.sort(…)</code> trực tiếp trên state — đổi thứ tự gốc, chọn "Sort: default" không quay về được.',
        '<code>useEffect(() => ref.current.focus())</code> thiếu <code>[]</code> — mỗi lần gõ ô khác, focus lại bị giật về ô tìm.',
        'Lưu danh sách đã lọc vào một state riêng rồi quên cập nhật khi thêm/xoá ⇒ hai nguồn sự thật lệch nhau.',
      ],
      moTaNgan: 'Lab chương 8 kiểu đề trường: app quản lý phim 8 chức năng, thang điểm 10, có Live demo + starter + chấm tự động từng chức năng.',
      giaiThich: '<p>Lời giải giữ <b>một nguồn sự thật</b>: mảng <code>movies</code> (trong <code>useLocalStorage</code>) + ba lựa chọn (search, genre, sortBy). Danh sách hiển thị được <em>suy ra</em> bằng <code>useMemo</code>, nên thêm/xoá/yêu thích tự phản ánh vào kết quả tìm/lọc/sắp xếp. Mọi thay đổi state dùng mảng MỚI (<code>[...list, m]</code>, <code>filter</code>, <code>map</code>) — React so tham chiếu để biết cần render lại. Theme đi qua Context để Header (và mọi component khác) đọc trực tiếp, không truyền props qua nhiều tầng.</p>',
      loaiKiem: 'react',
      tests: {
        loai: 'react',
        phienBan: 1,
        tepChinh: 'src/index.js',
        kiem: KIEM,
      },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/reference/react/hooks',
    },
  ],
});
