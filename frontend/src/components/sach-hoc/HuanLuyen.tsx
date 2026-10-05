'use client';
/**
 * 🧭 HUẤN LUYỆN — thẻ thứ hai trong khung CuongMini cạnh bài học (05/10/2026).
 *
 * Người dùng: "robot sẽ có một mục chuyên sâu riêng để theo dõi tiến độ… như gia sư bên cạnh
 * nhưng bản nâng cấp". Thẻ này gom: chuỗi ngày học (máy chủ), tiến độ từng buổi, bài tập điểm
 * thấp cần ôn (≤ 70%), bài nên học tiếp, và hai lối vào cuộc gọi CuongMini: luyện phát âm /
 * trò chuyện song ngữ. Mọi số đều lấy từ tiến độ thật (useTienDo + /ielts/chuoi).
 */
import { useEffect, useMemo, useState } from 'react';
import { Flame, Target, MessagesSquare, Mic, ChevronRight, AlertTriangle, Trophy } from 'lucide-react';
import api from '@/lib/api';
import { isReady, type Course } from './course';
import type { Chuoi } from './ChaoBuoiSang';
import s from './course.module.css';

export function HuanLuyen({ course, done, scores, loggedIn, onMoBai, onMoBuoi, onGoi }: {
  course: Course;
  done: string[];
  scores: Record<string, number>;
  loggedIn: boolean;
  onMoBai: (id: string) => void;
  onMoBuoi: (n: number) => void;
  onGoi: (cheDo: 'phat-am' | 'tro-chuyen') => void;
}) {
  const [chuoi, setChuoi] = useState<Chuoi | null>(null);
  useEffect(() => {
    if (!loggedIn) return;
    void api.get('/ielts/chuoi', { params: { stage: course.stage } }).then((r) => setChuoi(r.data?.data ?? null)).catch(() => undefined);
  }, [loggedIn, course.stage, done.length]);

  const ngay = useMemo(() => course.days.filter((d) => d.lessons.some(isReady)).map((d) => {
    const co = d.lessons.filter(isReady);
    return { n: d.n, ten: course.dayName(d.n), xong: co.filter((l) => done.includes(l.id)).length, tong: co.length };
  }), [course, done]);
  const tongBai = ngay.reduce((t, d) => t + d.tong, 0);
  const tongXong = ngay.reduce((t, d) => t + d.xong, 0);
  const baiTiep = course.readyLessons.find((l) => l.kind !== 'intro' && !done.includes(l.id));
  // Bài tập điểm thấp: id bài tập mở đầu bằng "bN-"/"dN-"… ⇒ tìm buổi qua tiền tố id bài cùng buổi.
  const yeu = useMemo(() => Object.entries(scores).filter(([, p]) => p < 70).sort((a, b) => a[1] - b[1]).slice(0, 5).map(([id, p]) => {
    const tienTo = /^([a-z]+\d+)-/.exec(id)?.[1];
    const d = tienTo ? course.days.find((x) => x.lessons.some((l) => l.id.startsWith(`${tienTo}-`))) : undefined;
    return { id, p, n: d?.n, ten: d ? course.dayName(d.n) : '' };
  }), [scores, course]);
  const tb = Object.values(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : null;
  const ten = course.lang === 'ja' ? 'tiếng Nhật' : course.lang === 'zh' ? 'tiếng Trung' : 'tiếng Anh';

  if (!loggedIn) return <p className={s.hello}>Đăng nhập để CuongMini theo dõi tiến độ và chuỗi ngày học của bạn.</p>;
  return (
    <div className={s.hlBoc}>
      <div className={s.hlTren}>
        <div className={s.hlChuoi} data-chay={(chuoi?.chuoi ?? 0) > 0 || undefined}>
          <Flame size={22} />
          <b>{chuoi?.chuoi ?? 0}</b>
          <span>ngày liên tiếp{chuoi && chuoi.kyLuc > 1 ? <small>kỷ lục {chuoi.kyLuc}</small> : null}</span>
          {chuoi && chuoi.chuoi > 1 && chuoi.chuoi >= chuoi.kyLuc && <i><Trophy size={11} /></i>}
        </div>
        <div className={s.hlSo}><b>{tongBai ? Math.round((tongXong / tongBai) * 100) : 0}%</b><small>{tongXong}/{tongBai} bài</small></div>
        <div className={s.hlSo}><b>{tb == null ? '—' : `${tb}%`}</b><small>điểm bài tập</small></div>
      </div>
      {chuoi && (
        <div className={s.hlTuan} title="14 ngày gần nhất">
          {chuoi.ngay.map((d, k) => <span key={d.day} title={`${d.day}: ${d.viec} việc`} data-co={d.viec > 0 || undefined} data-nay={k === chuoi.ngay.length - 1 || undefined} />)}
        </div>
      )}
      {chuoi && !chuoi.daHocHomNay && <p className={s.hlNhac}>🔥 Hôm nay chưa học — xong một bài (hoặc luyện nói 3 lượt) là giữ được chuỗi.</p>}

      {baiTiep && (
        <button type="button" className={s.hlTiep} onClick={() => onMoBai(baiTiep.id)}>
          <Target size={16} />
          <span><small>Nên học tiếp</small>{baiTiep.title}</span>
          <ChevronRight size={16} />
        </button>
      )}

      <div className={s.hlGoi}>
        <button type="button" onClick={() => onGoi('phat-am')}><Mic size={15} /> Luyện phát âm</button>
        <button type="button" onClick={() => onGoi('tro-chuyen')}><MessagesSquare size={15} /> Trò chuyện {ten}</button>
      </div>

      {yeu.length > 0 && (
        <section className={s.hlKhoi}>
          <h4><AlertTriangle size={14} /> Bài tập nên làm lại</h4>
          {yeu.map((y) => (
            <button key={y.id} type="button" className={s.hlDong} disabled={!y.n} onClick={() => y.n && onMoBuoi(y.n)}>
              <span className={s.hlDiem} data-thap={y.p < 50 || undefined}>{y.p}%</span>
              <span>{y.ten || y.id}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </section>
      )}

      <section className={s.hlKhoi}>
        <h4>Tiến độ từng buổi</h4>
        {ngay.map((d) => (
          <button key={d.n} type="button" className={s.hlBuoi} onClick={() => onMoBuoi(d.n)}>
            <span>{d.ten}</span>
            <span className={s.hlVach}><i style={{ width: `${d.tong ? (d.xong / d.tong) * 100 : 0}%` }} data-xong={d.xong === d.tong || undefined} /></span>
            <small>{d.xong}/{d.tong}</small>
          </button>
        ))}
      </section>
    </div>
  );
}
