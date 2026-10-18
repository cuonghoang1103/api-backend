'use client';

/**
 * 🧭 Chọn nội dung của buổi luyện (19/10/2026):
 *  - Trò chuyện: buổi đã lưu (Tiếp tục / Bắt đầu lại) + chủ đề theo trình độ (IELTS Part 1/2/3,
 *    JLPT N5–N3, HSK 1–4, nhập vai).
 *  - Luyện phát âm: bộ câu (của bài đang mở / bộ cơ bản) + vị trí đã lưu.
 */
import type { ChuDeWeb, PhienTomTat } from './apiCuongMini';
import { c, ngonNguUI } from './chu';
import s from '../course.module.css';

const ngayGio = (iso: string, en: boolean) => {
  try { return new Date(iso).toLocaleString(en ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
};

export function ChonChuDe({ chuDeDs, phien, chuDeId, tenBai, onChon, onTiep, onLai }: {
  chuDeDs: ChuDeWeb[];
  phien: PhienTomTat[];
  chuDeId: string;
  tenBai: string;
  onChon: (id: string) => void;
  onTiep: (p: PhienTomTat) => void;
  onLai: (p: PhienTomTat) => void;
}) {
  const ui = ngonNguUI();
  const en = ui === 'en';
  const nhom = new Map<string, ChuDeWeb[]>();
  for (const x of chuDeDs) { const k = en ? x.nhomEn : x.nhom; nhom.set(k, [...(nhom.get(k) ?? []), x]); }
  const ten = (id: string) => (id === 'bai-hien-tai' ? tenBai : chuDeDs.find((x) => x.id === id)?.[en ? 'tenEn' : 'ten'] ?? id);
  return (
    <div className={s.goiChon}>
      {phien.length > 0 && (
        <div className={s.goiChonNhom}>
          <div className={s.goiNhanMuc}>{c('tiepBuoiTruoc', ui)}</div>
          {phien.slice(0, 3).map((p) => (
            <div key={p.muc} className={s.goiPhien}>
              <div className={s.goiPhienTen}>
                <b>{p.ten || ten(p.muc.slice(3))}</b>
                <small>{p.soLuot} {c('luotDaNoi', ui)} · {ngayGio(p.capNhat, en)}</small>
                {p.cauCuoi && <small className={s.goiPhienCau}>“{p.cauCuoi}”</small>}
              </div>
              <div className={s.goiPhienNut}>
                <button type="button" className={s.goiNutChinh} onClick={() => onTiep(p)}>▶ {c('tiepTuc', ui)}</button>
                <button type="button" className={s.goiNutMo} onClick={() => onLai(p)}>↺ {c('batDauLai', ui)}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={s.goiChonNhom}>
        <div className={s.goiNhanMuc}>{phien.length ? c('chuDeKhac', ui) : c('chonNoiDung', ui)}</div>
        <div className={s.goiChipHang}>
          <button type="button" className={s.goiChip} data-chon={chuDeId === 'bai-hien-tai' || undefined} onClick={() => onChon('bai-hien-tai')}>
            📖 {tenBai || (en ? 'Free talk' : 'Trò chuyện tự do')}
          </button>
        </div>
        {[...nhom.entries()].map(([k, ds]) => (
          <div key={k}>
            <div className={s.goiChonPhu}>{k}</div>
            <div className={s.goiChipHang}>
              {ds.map((x) => (
                <button key={x.id} type="button" className={s.goiChip} data-chon={chuDeId === x.id || undefined} onClick={() => onChon(x.id)} title={x.tenGoc ?? ''}>
                  {x.cueCard ? '🗂️ ' : ''}{en ? x.tenEn : x.ten}{x.tenGoc && <small> {x.tenGoc}</small>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChonBoCau({ coBai, soCauBai, nguon, onNguon, phien, onTiep, onLai }: {
  coBai: boolean;
  soCauBai: number;
  nguon: 'bai' | 'chung';
  onNguon: (n: 'bai' | 'chung') => void;
  phien: PhienTomTat | null;
  onTiep: (p: PhienTomTat) => void;
  onLai: (p: PhienTomTat) => void;
}) {
  const ui = ngonNguUI();
  return (
    <div className={s.goiChon}>
      <div className={s.goiChipHang}>
        {coBai && <button type="button" className={s.goiChip} data-chon={nguon === 'bai' || undefined} onClick={() => onNguon('bai')}>📖 {c('boCauBai', ui)} ({soCauBai})</button>}
        <button type="button" className={s.goiChip} data-chon={nguon === 'chung' || undefined} onClick={() => onNguon('chung')}>🌱 {c('boCauCoBan', ui)}</button>
      </div>
      {phien && phien.viTri > 0 && (
        <div className={s.goiPhien}>
          <div className={s.goiPhienTen}>
            <b>{c('cauSo', ui)} {phien.viTri + 1}{phien.tongCau ? `/${phien.tongCau}` : ''}</b>
            <small>{phien.soLuot} {c('luotDaNoi', ui)}</small>
          </div>
          <div className={s.goiPhienNut}>
            <button type="button" className={s.goiNutChinh} onClick={() => onTiep(phien)}>▶ {c('tiepTuc', ui)}</button>
            <button type="button" className={s.goiNutMo} onClick={() => onLai(phien)}>↺ {c('batDauLai', ui)}</button>
          </div>
        </div>
      )}
    </div>
  );
}
