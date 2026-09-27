'use client';

/**
 * Tiến độ một khoá học kiểu sách (IELTS, tiếng Nhật…): bài đã học, điểm từng bài tập, kế hoạch học.
 *
 * Hai lớp lưu:
 *  - localStorage — để trang mở ra là có ngay, và vẫn chạy khi chưa đăng nhập;
 *  - `/api/v1/ielts/tien-do` (stage `sach1`) — người dùng học cả trên laptop
 *    lẫn iPad, tiến độ chỉ nằm trong một trình duyệt thì mỗi máy một kiểu.
 * Lúc tải: gộp hai nguồn (bài đã học = hợp; điểm và kế hoạch lấy bản server).
 */
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export type Plan = {
  /** YYYY-MM-DD — ngày học buổi đầu tiên. */
  start: string;
  /** Thứ trong tuần sẽ học: 0 = CN, 1 = T2 … 6 = T7. */
  days: number[];
  /** HH:MM — giờ học, dùng cho nhắc nhở trong Lịch. */
  time: string;
};

type State = { done: string[]; scores: Record<string, number>; plan: Plan | null };

const EMPTY: State = { done: [], scores: {}, plan: null };

function readLocal(KEY: string, legacyDoneKey?: string): State {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (v && Array.isArray(v.done)) return { ...EMPTY, ...v };
    // Bản đầu chỉ lưu mảng bài đã học ở khoá cũ.
    const old = legacyDoneKey ? JSON.parse(localStorage.getItem(legacyDoneKey) || '[]') : [];
    return { ...EMPTY, done: Array.isArray(old) ? old : [] };
  } catch {
    return EMPTY;
  }
}

function writeLocal(KEY: string, s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* chế độ riêng tư — vẫn còn bản trên server nếu đã đăng nhập */
  }
}

type Row = { kind: string; muc: string; xong: boolean; diem: number | null; ghiChu?: string | null };

/** `STAGE`: mã khoá trên máy chủ (sach1, dekiru1…); `storageKey`: tiền tố localStorage. */
export function useTienDo(loggedIn: boolean, STAGE: string, storageKey: string) {
  const KEY = `${storageKey}:state`;
  const [st, setSt] = useState<State>(EMPTY);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Khoá IELTS bản đầu chỉ lưu mảng bài đã học — vẫn đọc để không mất tiến độ cũ.
    setSt(readLocal(KEY, storageKey === 'ielts-v2' ? 'ielts-v2:done' : undefined));
  }, [KEY, storageKey]);

  useEffect(() => {
    if (!loggedIn) return;
    let alive = true;
    api.get('/ielts/tien-do', { params: { stage: STAGE } })
      .then((res) => {
        if (!alive) return;
        const rows: Row[] = res.data?.data?.items ?? [];
        setSt((cur) => {
          const done = new Set(cur.done);
          const scores = { ...cur.scores };
          let plan = cur.plan;
          for (const r of rows) {
            if (r.kind === 'bai' && r.xong) done.add(r.muc);
            if (r.kind === 'baitap' && r.diem != null) scores[r.muc] = r.diem;
            if (r.kind === 'kehoach' && r.ghiChu) {
              try { plan = JSON.parse(r.ghiChu); } catch { /* bản hỏng thì giữ bản máy */ }
            }
          }
          const next = { done: [...done], scores, plan };
          writeLocal(KEY, next);
          return next;
        });
        setSynced(true);
      })
      .catch(() => { /* mất mạng: dùng bản máy, lần sau đồng bộ lại */ });
    return () => { alive = false; };
  }, [loggedIn, STAGE, KEY]);

  const push = useCallback((items: { kind: string; muc: string; xong?: boolean; diem?: number | null; ghiChu?: string }[]) => {
    if (!loggedIn) return;
    api.post('/ielts/tien-do', { items: items.map((i) => ({ stage: STAGE, ...i })) }).catch(() => {});
  }, [loggedIn, STAGE]);

  const setDone = useCallback((id: string, on: boolean) => {
    setSt((cur) => {
      const done = on ? [...new Set([...cur.done, id])] : cur.done.filter((x) => x !== id);
      const next = { ...cur, done };
      writeLocal(KEY, next);
      return next;
    });
    if (on) push([{ kind: 'bai', muc: id, xong: true }]);
    else if (loggedIn) api.delete(`/ielts/tien-do/${STAGE}/bai/${encodeURIComponent(id)}`).catch(() => {});
  }, [push, loggedIn, STAGE, KEY]);

  const report = useCallback((quizId: string, pct: number) => {
    setSt((cur) => {
      const next = { ...cur, scores: { ...cur.scores, [quizId]: pct } };
      writeLocal(KEY, next);
      return next;
    });
    push([{ kind: 'baitap', muc: quizId, diem: pct }]);
  }, [push, KEY]);

  const savePlan = useCallback((plan: Plan | null) => {
    setSt((cur) => {
      const next = { ...cur, plan };
      writeLocal(KEY, next);
      return next;
    });
    if (plan) push([{ kind: 'kehoach', muc: 'ke-hoach', ghiChu: JSON.stringify(plan) }]);
    else if (loggedIn) api.delete(`/ielts/tien-do/${STAGE}/kehoach/ke-hoach`).catch(() => {});
  }, [push, loggedIn, STAGE, KEY]);

  return { ...st, synced, setDone, report, savePlan };
}

/* ── Lịch học ─────────────────────────────────────────────────────────── */

export const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const todayIso = () => iso(new Date());

/** Ngày học của từng buổi 1…n theo kế hoạch: lần lượt các ngày có thứ nằm trong `days`. */
export function schedule(plan: Plan, n: number): string[] {
  const out: string[] = [];
  const [y, m, d] = plan.start.split('-').map(Number);
  const cur = new Date(y, m - 1, d);
  const days = plan.days.length ? plan.days : [1, 2, 3, 4, 5];
  for (let guard = 0; out.length < n && guard < 400; guard++) {
    if (days.includes(cur.getDay())) out.push(iso(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function fmtDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAYS[dt.getDay()]}, ${d}/${m}`;
}

/**
 * File .ics cho ứng dụng Lịch (macOS, iPad, Google Calendar): mỗi buổi một sự
 * kiện kèm lời nhắc 10 phút trước. Chọn cách này thay vì thông báo đẩy của
 * web: nhắc nhở của Lịch chạy cả khi trình duyệt đang đóng, trên mọi máy đã
 * đồng bộ iCloud — đúng thứ người học trên laptop + iPad cần.
 */
export function buildIcs(plan: Plan, sessions: { n: number; title: string }[], url: string, courseTitle: string, stage: string): string {
  const dates = schedule(plan, sessions.length);
  const [hh, mm] = plan.time.split(':');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const esc = (t: string) => t.replace(/([,;\\])/g, '\\$1');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//cuongthai//${stage}//VI`, 'CALSCALE:GREGORIAN'];
  sessions.forEach((s, i) => {
    const d = dates[i].replace(/-/g, '');
    const endH = String(Math.min(23, Number(hh) + 1)).padStart(2, '0');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${stage}-buoi-${s.n}-${d}@cuongthai.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${d}T${hh}${mm}00`,
      `DTEND:${d}T${endH}${mm}00`,
      `SUMMARY:${esc(`${courseTitle} · Buổi ${s.n}: ${s.title}`)}`,
      `DESCRIPTION:${esc(`Mở bài học: ${url}`)}`,
      `URL:${url}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(`Đến giờ học ${courseTitle} — Buổi ${s.n}`)}`,
      'TRIGGER:-PT10M',
      'END:VALARM',
      'END:VEVENT',
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
