'use client';

/**
 * Nhận xét học tập hằng tuần của CuongMini (tiếng Anh, 24/11/2026).
 * Số liệu do MÃ tính trên máy chủ (khoá IELTS Tập 1–5 + Giao tiếp, thi máy, sổ lỗi, thẻ từ, sổ tay CT Language); chữ
 * nhận xét do model viết quanh các con số đó. Mở trang mà tuần đã khép gần nhất chưa có báo cáo ⇒ tự tạo một lần.
 * API: src/routes/ctlanguage.nhanXetTuan.routes.ts · app desktop dùng lại trang này (dinhTuyenWeb.ts).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiNhanXetTuan, loiNhanXet, type BaoCaoTuan, type DanhSachTuan, type SoLieuTuan } from '@/lib/ctlanguage/nhanXetTuan';
import s from './nhanXet.module.css';

const ddmm = (ngay: string) => `${ngay.slice(8, 10)}/${ngay.slice(5, 7)}`;
const KY: Record<string, string> = { doc: 'Reading', nghe: 'Listening', viet: 'Writing', noi: 'Speaking' };
const TIEU_CHI: Record<string, string> = {
  TR: 'Task Response / Achievement', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammar Range & Accuracy',
  fc: 'Fluency & Coherence', lr: 'Lexical Resource', gra: 'Grammar Range & Accuracy', p: 'Pronunciation',
};
const LOAI_VIEC: Record<string, string> = { hoc: 'Học', on: 'Ôn', thi: 'Thi', tu: 'Từ vựng' };

function docTuanUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const t = new URLSearchParams(window.location.search).get('tuan');
  return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
}
function ghiTuanUrl(tuan: string) {
  const u = new URL(window.location.href);
  u.searchParams.set('tuan', tuan);
  window.history.replaceState(window.history.state, '', u.toString());
}

function Delta({ nay, truoc, donVi = '' }: { nay: number; truoc: number; donVi?: string }) {
  const d = nay - truoc;
  if (!truoc && !nay) return <div className={s.tileDelta}>tuần trước 0</div>;
  return (
    <div className={s.tileDelta}>
      <span className={d > 0 ? s.up : d < 0 ? s.down : undefined}>{d > 0 ? '▲' : d < 0 ? '▼' : '='} {Math.abs(d)}{donVi}</span> so với tuần trước ({truoc}{donVi})
    </div>
  );
}

function SoLieu({ sl }: { sl: SoLieuTuan }) {
  const baiXong = sl.khoa.reduce((a, k) => a + k.baiXong, 0);
  const baiXongTruoc = sl.khoa.reduce((a, k) => a + k.baiXongTruoc, 0);
  const tuMoi = sl.tuVung.ielts.moi + sl.tuVung.ctl.moi;
  const tuMoiTruoc = sl.tuVung.ielts.moiTruoc + sl.tuVung.ctl.moiTruoc;
  const maxPhut = Math.max(30, ...sl.theoNgay.map((x) => x.phut));
  const khoaCo = sl.khoa.filter((k) => k.daXongTong > 0 || k.baiXong > 0);
  const kyCo = (['doc', 'nghe', 'viet', 'noi'] as const).filter((k) => sl.thi.kyNang[k].so > 0 || sl.thi.kyNang[k].bandTruoc != null);
  return (
    <>
      <section className={s.card}>
        <div className={s.cardHead}><h2 className={s.h2}>Số liệu tuần</h2><span className={s.note}>Do hệ thống tính — không phải AI ước đoán</span></div>
        <div className={s.tiles}>
          <div className={s.tile}><div className={s.tileLabel}>Ngày có học</div><div className={s.tileValue}>{sl.ngayHoc.so}/{sl.soNgayTinh}</div><Delta nay={sl.ngayHoc.so} truoc={sl.ngayHoc.truoc} /></div>
          <div className={s.tile}><div className={s.tileLabel}>Thời gian (ước tính)</div><div className={s.tileValue}>{sl.phut.tong}′</div><Delta nay={sl.phut.tong} truoc={sl.phut.truoc} donVi="′" /></div>
          <div className={s.tile}><div className={s.tileLabel}>Bài học xong</div><div className={s.tileValue}>{baiXong}</div><Delta nay={baiXong} truoc={baiXongTruoc} /></div>
          <div className={s.tile}><div className={s.tileLabel}>Từ mới</div><div className={s.tileValue}>{tuMoi}</div><Delta nay={tuMoi} truoc={tuMoiTruoc} /></div>
          <div className={s.tile}><div className={s.tileLabel}>Lượt thi máy</div><div className={s.tileValue}>{sl.thi.soLuot}</div><Delta nay={sl.thi.soLuot} truoc={sl.thi.soLuotTruoc} /></div>
          <div className={s.tile}><div className={s.tileLabel}>Chuỗi ngày học</div><div className={s.tileValue}>{sl.chuoi}</div><div className={s.tileDelta}>ngày liên tiếp</div></div>
        </div>
        <div className={s.chart} role="img" aria-label="Phút học ước tính theo ngày">
          {sl.theoNgay.map((x) => (
            <div key={x.ngay} className={s.col} title={`${x.thu} ${ddmm(x.ngay)}: ${x.phut} phút${x.coHoc ? '' : ' (không học)'}`}>
              <span className={s.barVal}>{x.phut || (x.coHoc ? '✓' : '')}</span>
              <div className={`${s.bar} ${x.coHoc ? s.barOn : ''}`} style={{ height: `${Math.max(2, (x.phut / maxPhut) * 110)}px` }} />
              <span className={s.barDay}>{x.thu}</span>
            </div>
          ))}
        </div>
        <p className={s.note} style={{ marginTop: 8 }}>
          Phút = {sl.phut.baiHoc}′ bài học (theo thời lượng bài) + {sl.phut.thiMay}′ thi máy + {sl.phut.appCTL}′ app CT Language + {sl.phut.onThe}′ ôn thẻ (≈12 giây/thẻ). Cột đậm = ngày có học.
        </p>
      </section>

      {(khoaCo.length > 0 || sl.tuVung.ielts.luotOn > 0 || sl.tuVung.ctl.tongThe > 0) && (
        <section className={s.card}>
          <div className={s.cardHead}><h2 className={s.h2}>Khoá học & từ vựng</h2></div>
          <div className={s.rows}>
            {khoaCo.map((k) => (
              <div key={k.stage} className={s.row}>
                <Link href={k.buoiKeTiep ? `${k.duong}?buoi=${k.buoiKeTiep}` : k.duong} className={s.link}>{k.ten}</Link>
                <div className={s.track} title={`${k.daXongTong}/${k.tongBai} bài`}><div className={s.fill} style={{ width: `${k.tiLe}%` }} /></div>
                <div className={s.rowMeta}>
                  +{k.baiXong} bài · {k.tiLe}%{k.baiTap.tb != null ? ` · BT ${k.baiTap.tb}%` : ''}
                </div>
              </div>
            ))}
          </div>
          <ul className={s.list} style={{ marginTop: 12 }}>
            {sl.tuVung.ielts.luotOn > 0 && (
              <li>Thẻ IELTS: {sl.tuVung.ielts.luotOn} lượt ôn, {sl.tuVung.ielts.moi} từ mới{sl.tuVung.ielts.tiLeNho != null ? `, nhớ ${sl.tuVung.ielts.tiLeNho}%` : ''} · đã thuộc {sl.tuVung.ielts.daThuoc} từ</li>
            )}
            {sl.tuVung.ctl.tongThe > 0 && (
              <li>Sổ tay CT Language: +{sl.tuVung.ctl.moi} từ, ôn {sl.tuVung.ctl.daOn} từ · nhớ sâu {sl.tuVung.ctl.nhoSau}/{sl.tuVung.ctl.tongThe} · đến hạn {sl.tuVung.ctl.denHan}</li>
            )}
            {sl.tuVung.loTrinh && sl.tuVung.loTrinh.ngayDaXong > 0 && (
              <li>Lộ trình từ vựng theo ngày: xong {sl.tuVung.loTrinh.ngayDaXong}/{sl.tuVung.loTrinh.tongNgay} ngày{sl.tuVung.loTrinh.ngayKeTiep ? ` · tiếp theo: ${sl.tuVung.loTrinh.ngayKeTiep.ten}` : ''}</li>
            )}
            {(sl.soLoi.moi > 0 || sl.soLoi.denHan > 0) && (
              <li>Sổ lỗi: {sl.soLoi.moi} câu sai mới, {sl.soLoi.vung} câu ôn vững, {sl.soLoi.denHan} câu đến hạn làm lại</li>
            )}
          </ul>
        </section>
      )}

      {kyCo.length > 0 && (
        <section className={s.card}>
          <div className={s.cardHead}><h2 className={s.h2}>Thi máy IELTS</h2>{sl.thi.bandTong != null && <span className={s.badge}>Full test: band {sl.thi.bandTong}</span>}</div>
          <table className={s.table}>
            <thead><tr><th>Kỹ năng</th><th>Lượt</th><th>Band tuần này</th><th>Tuần trước</th><th>% đúng</th></tr></thead>
            <tbody>
              {kyCo.map((k) => {
                const x = sl.thi.kyNang[k];
                return (
                  <tr key={k}>
                    <td>{KY[k]}</td><td className={s.num}>{x.so}</td>
                    <td className={s.num}>{x.bandTb ?? '—'}</td><td className={s.num}>{x.bandTruoc ?? '—'}</td>
                    <td className={s.num}>{x.dungTb != null ? `${x.dungTb}%` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {[['Writing', sl.thi.tieuChiViet], ['Speaking', sl.thi.tieuChiNoi]].map(([ten, tc]) => tc && (
            <div key={ten as string} style={{ marginTop: 14 }}>
              <div className={s.note} style={{ marginBottom: 6 }}>{ten as string} — trung bình từng tiêu chí (AI chấm ở phòng thi máy)</div>
              <div className={s.rows}>
                {Object.entries(tc as Record<string, number>).map(([ma, band]) => (
                  <div key={ma} className={s.row}>
                    <span>{TIEU_CHI[ma] ?? ma}</span>
                    <div className={s.track}><div className={s.fill} style={{ width: `${(band / 9) * 100}%` }} /></div>
                    <span className={s.rowMeta}>{band}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {sl.thi.azure != null && <p className={s.note} style={{ marginTop: 8 }}>Điểm phát âm (Azure) trung bình các lượt Speaking: {sl.thi.azure}/100.</p>}
        </section>
      )}
    </>
  );
}

function BaoCao({ bc, onTaoLai, dangTao }: { bc: BaoCaoTuan; onTaoLai: () => void; dangTao: boolean }) {
  const nx = bc.nhanXet;
  const sl = bc.soLieu;
  const hetLuot = bc.conLanTaoLai != null && bc.conLanTaoLai <= 0;
  return (
    <div>
      <section className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.h2}>Tuần {ddmm(bc.tuNgay)} – {ddmm(bc.denNgay)}{bc.dangDo ? ' (đang học, tính tới hôm nay)' : ''}</h2>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`${s.badge} ${bc.nguon === 'ma' ? s.badgeWarn : ''}`} title={bc.nguon === 'ai' ? 'Chữ do CuongMini viết dựa trên số liệu' : 'AI chưa viết được — chữ do hệ thống tự soạn từ số liệu'}>
              {bc.nguon === 'ai' ? 'CuongMini viết' : 'Bản tự động (chưa có AI)'}
            </span>
            <button type="button" className={s.btn} onClick={onTaoLai} disabled={dangTao || hetLuot}
              title={hetLuot ? 'Đã hết lượt tạo lại của tuần này' : 'Tính lại số liệu và viết lại nhận xét'}>
              {dangTao ? 'Đang tạo…' : `Tạo lại${bc.conLanTaoLai != null ? ` (còn ${bc.conLanTaoLai})` : ''}`}
            </button>
          </span>
        </div>
        <p className={s.lead}>{nx.tongQuan}</p>
      </section>

      <SoLieu sl={sl} />

      {nx.diemManh.length > 0 && (
        <section className={s.card}>
          <div className={s.cardHead}><h2 className={s.h2}>Điểm mạnh</h2></div>
          <ul className={s.list}>{nx.diemManh.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      {bc.diemYeu.length > 0 && (
        <section className={s.card}>
          <div className={s.cardHead}><h2 className={s.h2}>{bc.diemYeu.length} điểm yếu ưu tiên</h2><span className={s.note}>Xếp theo mức ảnh hưởng, mỗi điểm có số liệu làm bằng chứng</span></div>
          {bc.diemYeu.map((y, i) => {
            const v = nx.diemYeu.find((x) => x.ma === y.ma);
            return (
              <div key={y.ma} className={s.weak}>
                <div className={s.weakHead}><span className={s.weakNo}>{i + 1}</span><span className={s.weakTitle}>{y.tieuDe}</span></div>
                <div className={s.evidence}>📊 {y.bangChung}</div>
                {v && v.nhanXet !== y.bangChung && <p className={s.weakText}><b>Vì sao quan trọng:</b> {v.nhanXet}</p>}
                {v && <p className={s.weakText}><b>Cách sửa:</b> {v.cachSua}</p>}
                <Link href={y.lienKet.href} className={s.link}>{y.lienKet.nhan} →</Link>
              </div>
            );
          })}
        </section>
      )}

      <section className={s.card}>
        <div className={s.cardHead}><h2 className={s.h2}>Kế hoạch tuần sau</h2><span className={s.note}>Bấm vào việc để mở đúng bài / ngày học</span></div>
        <div className={s.plan}>
          {bc.keHoach.map((d) => (
            <div key={d.ngay} className={s.day}>
              <div className={s.dayHead}>{d.thu}<span className={s.dayDate}>{ddmm(d.ngay)}</span></div>
              {d.viec.map((v, i) => (
                <Link key={i} href={v.href} className={s.task}>
                  {v.nhan}<span className={s.taskMeta}>{LOAI_VIEC[v.loai] ?? v.loai} · ~{v.phut} phút</span>
                </Link>
              ))}
              {nx.keHoachGhiChu[d.thu] && <div className={s.dayNote}>{nx.keHoachGhiChu[d.thu]}</div>}
            </div>
          ))}
        </div>
      </section>

      <div className={s.msg}>
        <span aria-hidden style={{ fontSize: 26 }}>🐻</span>
        <div><div className={s.msgName}>CuongMini nhắn</div><p className={s.lead} style={{ fontSize: 15 }}>{nx.loiNhan}</p></div>
      </div>

      {sl.nguonDuLieu && (
        <details className={s.card}>
          <summary className={s.h2} style={{ cursor: 'pointer' }}>Nguồn dữ liệu của báo cáo này</summary>
          <div className={s.src} style={{ marginTop: 12 }}>
            {sl.nguonDuLieu.map((n) => (
              <div key={n.ma} style={{ display: 'contents' }}>
                <span className={n.co ? s.srcOk : s.srcNo}>{n.co ? '✓' : '–'}</span>
                <span>{n.ten}{n.ghiChu && <span className={s.srcNote}> — {n.ghiChu}</span>}</span>
              </div>
            ))}
          </div>
          <p className={s.note} style={{ marginTop: 10 }}>✓ = tuần này có dữ liệu. – = không có dữ liệu tuần này, hoặc máy chủ không lưu loại này.</p>
        </details>
      )}
    </div>
  );
}

export default function NhanXetTuanPage() {
  const code = String(useParams().code ?? '');
  const isAuthenticated = useAuthStore((x) => x.isAuthenticated);
  const isHydrated = useAuthStore((x) => x.isHydrated);
  const [ds, setDs] = useState<DanhSachTuan | null>(null);
  const [chon, setChon] = useState<string | null>(null);
  const [bc, setBc] = useState<BaoCaoTuan | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [dangTao, setDangTao] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const daTuTao = useRef(false);

  const taiDs = useCallback(async () => {
    const d = await apiNhanXetTuan.danhSach();
    setDs(d);
    return d;
  }, []);

  const tao = useCallback(async (tuan: string, lamLai = false) => {
    setDangTao(true); setLoi(null);
    try {
      const r = await apiNhanXetTuan.tao(tuan, lamLai);
      setBc(r); setChon(r.tuan); ghiTuanUrl(r.tuan);
      await taiDs();
    } catch (e) { setLoi(loiNhanXet(e)); } finally { setDangTao(false); }
  }, [taiDs]);

  const mo = useCallback(async (tuan: string) => {
    setChon(tuan); setLoi(null); setDangTai(true); ghiTuanUrl(tuan);
    try { setBc(await apiNhanXetTuan.mot(tuan)); } catch (e) { setBc(null); setLoi(loiNhanXet(e)); } finally { setDangTai(false); }
  }, []);

  useEffect(() => {
    if (code !== 'en' || !isHydrated || !isAuthenticated) return;
    let huy = false;
    (async () => {
      try {
        const d = await taiDs();
        if (huy) return;
        const tuUrl = docTuanUrl();
        if (tuUrl && d.ds.some((x) => x.tuan === tuUrl)) { void mo(tuUrl); return; }
        // Mở trang mà tuần đã khép gần nhất chưa có báo cáo ⇒ tạo một lần (máy chủ cũng tự làm lại báo cáo tuần dở).
        if (!d.coTuanGoiY && !daTuTao.current) { daTuTao.current = true; void tao(d.tuanGoiY); return; }
        void mo(d.coTuanGoiY ? d.tuanGoiY : d.ds[0]?.tuan ?? d.tuanGoiY);
      } catch (e) { if (!huy) setLoi(loiNhanXet(e)); }
    })();
    return () => { huy = true; };
  }, [code, isHydrated, isAuthenticated, taiDs, tao, mo]);

  const coTuanNay = useMemo(() => !!ds?.ds.some((x) => x.tuan === ds.tuanHienTai), [ds]);

  const doiEmail = async (v: boolean) => {
    try { const r = await apiNhanXetTuan.datCaiDat(v); setDs((d) => (d ? { ...d, caiDat: r } : d)); } catch (e) { setLoi(loiNhanXet(e)); }
  };

  if (code !== 'en') {
    return (
      <main className={s.root}><div className={`${s.wrap} ${s.center}`}>
        Nhận xét tuần hiện có cho tiếng Anh. <Link href="/language/en/nhan-xet-tuan" className={s.link}>Mở nhận xét tiếng Anh</Link>
      </div></main>
    );
  }

  return (
    <main className={s.root}>
      <div className={s.wrap}>
        <div className={s.top}>
          <Link href="/language/en" className={s.back}>← Tiếng Anh</Link>
        </div>
        <h1 className={s.h1}>Nhận xét học tập tuần</h1>
        <p className={s.sub}>CuongMini đọc số liệu thật của bạn (IELTS Tập 1–5, Giao tiếp, thi máy, sổ lỗi, thẻ từ, app CT Language) và chỉ đúng chỗ cần sửa.</p>

        {!isHydrated ? (
          <div className={s.center}><div className={s.spinner} />Đang tải…</div>
        ) : !isAuthenticated ? (
          <div className={s.center}>
            Cần đăng nhập để CuongMini đọc tiến độ học theo tài khoản của bạn.{' '}
            <Link href="/login" className={s.link}>Đăng nhập</Link>
          </div>
        ) : (
          <div className={s.layout} style={{ marginTop: 20 }}>
            <aside className={s.side} aria-label="Các tuần">
              {ds?.ds.map((w) => (
                <button key={w.tuan} type="button" className={`${s.week} ${chon === w.tuan ? s.weekOn : ''}`} onClick={() => void mo(w.tuan)}>
                  {ddmm(w.tuNgay)} – {ddmm(w.denNgay)}{w.dangDo ? ' · dở' : ''}
                  <div className={s.weekMeta}>{w.trong ? 'Chưa có hoạt động' : `${w.ngayHoc}/${w.soNgayTinh} ngày · ${w.phut}′ · ${w.baiXong} bài`}</div>
                </button>
              ))}
              {ds && !coTuanNay && (
                <button type="button" className={s.btn} disabled={dangTao} onClick={() => void tao(ds.tuanHienTai)}>
                  + Tuần đang học (tới hôm nay)
                </button>
              )}
              {ds && (
                <>
                  <label className={s.toggle} style={{ marginTop: 10 }}>
                    <input type="checkbox" checked={ds.caiDat.guiEmail} onChange={(e) => void doiEmail(e.target.checked)} />
                    Gửi email tóm tắt mỗi tuần
                  </label>
                  <p className={s.sideNote}>
                    Báo cáo tự tạo khi bạn mở trang sau mỗi tuần (thứ Hai → Chủ nhật).
                    {ds.tranTaoLai != null ? ` Mỗi tuần được tạo lại tối đa ${ds.tranTaoLai} lần.` : ''}
                  </p>
                </>
              )}
            </aside>

            <div>
              {loi && <div className={s.error} role="alert">{loi}</div>}
              {dangTao ? (
                <div className={`${s.card} ${s.center}`}><div className={s.spinner} />CuongMini đang đọc số liệu tuần của bạn và viết nhận xét… (thường 10–40 giây)</div>
              ) : dangTai ? (
                <div className={`${s.card} ${s.center}`}><div className={s.spinner} />Đang mở báo cáo…</div>
              ) : bc ? (
                <BaoCao bc={bc} dangTao={dangTao} onTaoLai={() => void tao(bc.tuan, true)} />
              ) : ds && !loi ? (
                <div className={`${s.card} ${s.center}`}>Chưa có báo cáo nào.</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
