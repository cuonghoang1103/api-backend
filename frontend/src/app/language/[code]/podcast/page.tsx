'use client';

/**
 * Podcast theo cấp — bản web của app CT Language (`Modules/Podcast/PodcastCTL.swift`), 24/11/2026.
 * Danh mục (Đời sống · Podcast chia sẻ · Software Engineering · Công sở) → tập gom theo cấp dễ → khó.
 * Tiến độ "đã nghe xong + điểm" lưu trên trình duyệt (app cũng lưu trên máy — chưa có tuyến đồng bộ).
 */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Briefcase, CheckCircle2, Clock, Code2, Home, MessageSquareText, Mic, PlayCircle, Users } from 'lucide-react';
import { KhungCTL, TEN_NN, capCss, css as s, moTaCap } from '@/components/language/ctl/chung';
import { apiPodcast, loiMang, nnTuCode, type DanhSachPodcast } from '@/lib/ctlanguage/api';
import { khoPodcast } from '@/lib/ctlanguage/khoTrinhDuyet';

const ICON_DM: Record<string, typeof Home> = { 'doi-song': Home, 'chia-se': Mic, 'phan-mem': Code2, 'cong-viec': Briefcase };
const KHOA_DM = 'ctl:podcast:danh-muc';

export default function PodcastPage() {
  const code = String(useParams().code);
  const nn = nnTuCode(code);
  const [dm, setDm] = useState('doi-song');
  const [ds, setDs] = useState<DanhSachPodcast | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const td = khoPodcast.useGiaTri();

  useEffect(() => { try { const v = localStorage.getItem(KHOA_DM); if (v) setDm(v); } catch { /* bỏ qua */ } }, []);
  useEffect(() => {
    if (!nn) return;
    let song = true;
    setLoi(null);
    apiPodcast.danhSach(nn, dm).then((d) => song && setDs(d)).catch((e) => song && setLoi(loiMang(e)));
    return () => { song = false; };
  }, [nn, dm]);

  const tatCa = useMemo(() => ds?.cap.flatMap((g) => g.tap) ?? [], [ds]);
  const tiep = tatCa.find((t) => !td.xong.includes(t.id));
  const xongDm = tatCa.filter((t) => td.xong.includes(t.id)).length;

  if (!nn) {
    return <KhungCTL code={code} dangO="podcast" tieuDe="Podcast"><div className={s.trong}>Podcast có cho tiếng Anh, tiếng Nhật và tiếng Trung.</div></KhungCTL>;
  }

  return (
    <KhungCTL code={code} dangO="podcast" tieuDe={`Podcast · ${TEN_NN[nn]}`}>
      <p className={s.eyebrow}>{TEN_NN[nn]} · Nghe để học</p>
      <h1 className={s.h1}>Podcast theo cấp</h1>
      <p className={s.lede}>
        Kịch bản tự soạn từ dễ tới khó, đọc bằng giọng người thật theo từng nhân vật. Chạm vào một từ để xem nghĩa, cách đọc và
        lưu vào sổ; nghe lại từng câu, nghe chậm, che chữ để luyện tai; cuối tập có từ vựng và câu hỏi hiểu bài.
      </p>

      <div className={s.section}>
        <div className={s.chips} role="tablist" aria-label="Danh mục">
          {(ds?.danhMuc ?? [{ ma: 'doi-song', ten: 'Đời sống', moTa: '', bieuTuong: '', soTap: 0 }]).map((d) => {
            const Ico = ICON_DM[d.ma] ?? MessageSquareText;
            return (
              <button key={d.ma} type="button" role="tab" aria-selected={d.ma === dm} className={s.chip} data-on={d.ma === dm || undefined}
                onClick={() => { setDm(d.ma); try { localStorage.setItem(KHOA_DM, d.ma); } catch { /* bỏ qua */ } }}>
                <Ico size={15} /> {d.ten} {d.soTap ? <span className={s.chipSo}>{d.soTap}</span> : null}
              </button>
            );
          })}
        </div>
        {ds?.danhMuc.find((d) => d.ma === dm)?.moTa ? <p className={s.note} style={{ marginTop: 10 }}>{ds.danhMuc.find((d) => d.ma === dm)!.moTa}</p> : null}
      </div>

      {loi ? <div className={s.loi} style={{ marginTop: 24 }}>{loi}</div> : null}
      {!ds && !loi ? <div className={s.trong}>Đang tải các tập…</div> : null}

      {ds && tiep ? (
        <div className={s.section}>
          <Link href={`/language/${code}/podcast/${tiep.id}`} className={`${s.card} ${s.cardPad}`} style={{ display: 'flex', alignItems: 'center', gap: 14, ...capCss(tiep.cap) }}>
            <span className={s.bia}><PlayCircle size={26} /></span>
            <div className={s.minh}>
              <div className={s.note}>{xongDm ? `Đã nghe ${xongDm}/${tatCa.length} tập · nghe tiếp` : 'Bắt đầu từ tập đầu tiên'}</div>
              <div className={s.epTitle}>{tiep.tieuDe}</div>
              <div className={s.epViet}>{tiep.cap} · {tiep.tieuDeViet}</div>
            </div>
            <span className={s.btn}>Nghe</span>
          </Link>
        </div>
      ) : null}

      {ds?.cap.map((g) => (
        <section key={g.cap} className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.h2}><span className={s.capTag} style={capCss(g.cap)}>{g.cap}</span> {moTaCap(g.cap)}</h2>
            <span className={s.note}>{g.tap.filter((t) => td.xong.includes(t.id)).length}/{g.tap.length} tập đã nghe</span>
          </div>
          <div className={s.grid}>
            {g.tap.map((t) => {
              const xong = td.xong.includes(t.id);
              const Ico = ICON_DM[t.danhMuc ?? 'doi-song'] ?? Mic;
              return (
                <Link key={t.id} href={`/language/${code}/podcast/${t.id}`} className={s.epCard} style={capCss(t.cap) as CSSProperties}>
                  <span className={s.bia}><Ico size={22} /><span className={s.biaCap}>Tập {t.so}</span></span>
                  <div className={s.epBody}>
                    <div className={`${s.epTitle} ${s.ten2}`}>{t.tieuDe}</div>
                    <div className={s.epViet}>{t.tieuDeViet}</div>
                    <div className={s.epMeta}>
                      <span><Clock size={13} /> {t.phut} phút</span>
                      <span><MessageSquareText size={13} /> {t.soDong} câu · {t.soTu} từ</span>
                      {t.nguoi.length ? <span><Users size={13} /> {t.nguoi.join(', ')}</span> : null}
                      {xong ? <span className={s.xong}><CheckCircle2 size={13} /> Đã nghe{td.diem[t.id] != null ? ` · ${td.diem[t.id]}%` : ''}</span> : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
      {ds && !ds.cap.length ? <div className={s.trong}>Danh mục này chưa có tập nào.</div> : null}
    </KhungCTL>
  );
}
