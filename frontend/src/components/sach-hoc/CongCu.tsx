'use client';

/**
 * 🧰 Công cụ & tra cứu của khoá (09/11/2026). Người học: "bấm vào ngôn ngữ thì vào thẳng lộ trình từng ngày; các
 * tool và chức năng của bản cũ để ở trong vị trí ngôn ngữ đang học — mặc định ẩn, ấn nút mới hiện ra để dùng,
 * tra cứu, luyện tập… tổng hợp đầy đủ dựa trên all bài đã soạn".
 *
 *  ① Theo kỹ năng — GOM mọi mục của mọi bài trong khoá theo loại (nghe, đọc, ngữ pháp, chữ Hán…): bấm là mở đúng mục.
 *  ② Công cụ — các trang kỹ năng /language/<mã>/… của bản cũ (bảng chữ, kho từ, AI chữa bài…), sổ tay, thống kê.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  X, Type, BookOpen, GraduationCap, Headphones, MessagesSquare, Newspaper, HelpCircle, PenLine, Bot, Languages,
  SpellCheck, PenTool, Route, Dumbbell, NotebookPen, BarChart3, ChevronDown, ChevronRight, LayoutGrid, Search,
} from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import { KHOA_PHU } from '@/lib/khoaChinh';
import { isReady, type Course } from './course';
import type { Kind, Lesson } from './types';
import st from './congCu.module.css';

const THU_TU_KIND: Kind[] = ['kana', 'vocab', 'grammar', 'kanji', 'conversation', 'listening', 'reading', 'speaking', 'writing', 'homework', 'review'];

const TRANG_KY_NANG = [
  { key: 'alphabet', label: 'Bảng chữ cái', desc: 'Chữ cái & phát âm', icon: Type },
  { key: 'vocab', label: 'Kho từ vựng', desc: 'Học & ôn thẻ theo chủ đề (lặp ngắt quãng)', icon: BookOpen },
  { key: 'grammar', label: 'Ngữ pháp', desc: 'Tra cấu trúc câu', icon: GraduationCap },
  { key: 'hanzi', label: 'Luyện viết chữ Hán', desc: 'Nét mẫu, tô theo & viết', icon: PenTool, cjk: true },
  { key: 'listening', label: 'Nghe', desc: 'Luyện nghe & shadowing', icon: Headphones },
  { key: 'conversation', label: 'Giao tiếp', desc: 'Hội thoại hằng ngày', icon: MessagesSquare },
  { key: 'reading', label: 'Đọc', desc: 'Bài đọc & báo', icon: Newspaper },
  { key: 'qna', label: 'Q&A', desc: 'Câu hỏi thường gặp', icon: HelpCircle },
] as const;

const TRANG_AI = [
  { key: 'writing', label: 'Luyện viết', desc: 'AI chữa bài & chấm điểm', icon: PenLine },
  { key: 'roleplay', label: 'Hội thoại AI', desc: 'Nhập vai tình huống', icon: Bot },
  { key: 'translate', label: 'Dịch văn bản', desc: 'Dịch 2 chiều & giải thích', icon: Languages },
  { key: 'grammar-check', label: 'Kiểm tra ngữ pháp', desc: 'Soi lỗi, chấm & sửa', icon: SpellCheck },
] as const;

export function CongCu({ course, mo, dong, moBai }: {
  course: Course;
  mo: boolean;
  dong: () => void;
  moBai: (l: Lesson) => void;
}) {
  const code = course.lang;
  const [tab, setTab] = useState<'kynang' | 'congcu'>('kynang');
  const [kindMo, setKindMo] = useState<Kind | null>(null);
  const [tim, setTim] = useState('');
  const [dem, setDem] = useState<Record<string, number> | null>(null);

  // Số mục của các trang kỹ năng (máy chủ) — tải khi mở lần đầu.
  useEffect(() => {
    if (!mo || dem) return;
    languageApi.overview(code).then((r) => setDem((r.data.data?.counts ?? {}) as Record<string, number>)).catch(() => setDem({}));
  }, [mo, dem, code]);

  // Esc đóng ngăn.
  useEffect(() => {
    if (!mo) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') dong(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [mo, dong]);

  // Mục của MỌI bài trong khoá, gom theo loại; kèm tên buổi để biết mục thuộc bài nào.
  const nhom = useMemo(() => {
    const buoiCua = new Map<string, string>();
    for (const d of course.days) for (const l of d.lessons) buoiCua.set(l.id, course.dayName(d.n));
    const theoKind = new Map<Kind, { l: Lesson; buoi: string }[]>();
    for (const d of course.days) {
      for (const l of d.lessons) {
        if (!isReady(l)) continue;
        const ds = theoKind.get(l.kind) ?? [];
        ds.push({ l, buoi: buoiCua.get(l.id) ?? '' });
        theoKind.set(l.kind, ds);
      }
    }
    return THU_TU_KIND.filter((k) => theoKind.has(k)).map((k) => ({ kind: k, muc: theoKind.get(k)! }));
  }, [course]);

  const q = tim.trim().toLowerCase();
  const locMuc = (ds: { l: Lesson; buoi: string }[]) => (q ? ds.filter(({ l, buoi }) => `${buoi} ${l.title}`.toLowerCase().includes(q)) : ds);

  if (!mo) return null;
  const laCjk = code === 'ja' || code === 'zh';
  const phu = KHOA_PHU[code] ?? [];

  return (
    <div className={st.nen} role="dialog" aria-modal="true" aria-label="Công cụ & tra cứu" onClick={(e) => { if (e.target === e.currentTarget) dong(); }}>
      <aside className={st.ngan}>
        <header className={st.dau}>
          <div>
            <b>🧰 Công cụ & tra cứu</b>
            <small>{course.title}</small>
          </div>
          <button type="button" className={st.dongBtn} onClick={dong} aria-label="Đóng"><X size={18} /></button>
        </header>

        <div className={st.tabs} role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'kynang'} className={tab === 'kynang' ? st.tabOn : ''} onClick={() => setTab('kynang')}>
            <LayoutGrid size={15} /> Theo kỹ năng
          </button>
          <button type="button" role="tab" aria-selected={tab === 'congcu'} className={tab === 'congcu' ? st.tabOn : ''} onClick={() => setTab('congcu')}>
            <Dumbbell size={15} /> Công cụ
          </button>
        </div>

        {tab === 'kynang' ? (
          <div className={st.than}>
            <p className={st.ghi}>Mọi mục của mọi bài trong khoá, gom theo kỹ năng — muốn luyện riêng phần nghe, đọc, chữ Hán… thì mở ở đây.</p>
            <label className={st.tim}>
              <Search size={15} aria-hidden />
              <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm mục (vd. Bài 12, て形, bị động…)" />
            </label>
            {nhom.map(({ kind, muc }) => {
              const loc = locMuc(muc);
              if (!loc.length) return null;
              const moK = kindMo === kind || (!!q && loc.length <= 30);
              return (
                <section key={kind} className={st.kind} style={{ ['--k' as string]: course.hue(kind) }}>
                  <button type="button" className={st.kindDau} aria-expanded={moK} onClick={() => setKindMo(moK && !q ? null : kind)}>
                    <span className={st.kindCham} aria-hidden />
                    <span className={st.kindTen}>{course.label(kind)}</span>
                    <span className={st.kindSo}>{loc.length} mục</span>
                    {moK ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {moK && (
                    <ul className={st.ds}>
                      {loc.map(({ l, buoi }) => (
                        <li key={l.id}>
                          <button type="button" onClick={() => { moBai(l); dong(); }}>
                            <span className={st.buoi}>{buoi}</span>
                            <span className={st.tenMuc}>{l.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className={st.than}>
            <div className={st.luoi}>
              <Link href={`/language/${code}/roadmap`} className={st.o}><Route size={18} /><b>Lộ trình</b><small>Từng chặng từ số 0</small></Link>
              <Link href={`/language/${code}/practice`} className={st.o}><Dumbbell size={18} /><b>Luyện tập</b><small>Bài ngắn mỗi ngày · XP · chuỗi ngày</small></Link>
              <Link href={`/language/notebook?code=${code}`} className={st.o}><NotebookPen size={18} /><b>Sổ tay</b><small>Từ & câu bạn đã lưu</small></Link>
              <Link href={`/language/${code}/stats`} className={st.o}><BarChart3 size={18} /><b>Thống kê</b><small>Tiến độ & thẻ đến hạn</small></Link>
            </div>

            <h4 className={st.h}>Kỹ năng</h4>
            <ul className={st.hang}>
              {TRANG_KY_NANG.filter((t) => !('cjk' in t) || laCjk).map((t) => {
                const n = dem?.[t.key] ?? 0;
                const Icon = t.icon;
                return (
                  <li key={t.key}>
                    <Link href={`/language/${code}/${t.key}`}>
                      <Icon size={17} aria-hidden />
                      <span><b>{t.label}</b><small>{t.desc}</small></span>
                      <em>{dem === null ? '…' : n > 0 ? `${n.toLocaleString('vi-VN')} mục` : ''}</em>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <h4 className={st.h}>Công cụ AI <span className={st.pro}>PRO</span></h4>
            <ul className={st.hang}>
              {TRANG_AI.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.key}>
                    <Link href={`/language/${code}/${t.key}`}>
                      <Icon size={17} aria-hidden />
                      <span><b>{t.label}</b><small>{t.desc}</small></span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {phu.length > 0 && (
              <>
                <h4 className={st.h}>Khoá khác cùng ngôn ngữ</h4>
                <ul className={st.hang}>
                  {phu.map((k) => (
                    <li key={k.href}><Link href={k.href}><BookOpen size={17} aria-hidden /><span><b>{k.ten}</b></span></Link></li>
                  ))}
                </ul>
              </>
            )}
            <Link href={`/language/${code}?hub=1`} className={st.cu}>Mở trang kỹ năng kiểu cũ →</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
