/**
 * ============================================================
 * BẢNG VIỆC — quản lý việc ngắn hạn và dài hạn
 * ============================================================
 *
 * Bản trước chỉ có "việc hôm nay": một ô nhập, một danh sách phẳng, tick được
 * và hết. Không có chỗ cho kế hoạch dài hơn một ngày, không ghi chú được, không
 * đặt hạn, không nhắc. Nghĩa là mọi thứ quan trọng hơn một việc vặt đều phải
 * nằm ở chỗ khác — và một trang kế hoạch mà không giữ nổi kế hoạch thì người ta
 * thôi mở nó.
 *
 * ─── Năm phạm vi, và vì sao đúng năm ───
 * Hôm nay · Tuần · Tháng · Quý · Năm. Đây là các mốc người ta THẬT SỰ nghĩ
 * theo khi lập kế hoạch, và mỗi mốc gấp khoảng 3-4 lần mốc trước nên không có
 * hai tab nào nghe giống nhau. Thêm "ngày mai" hay "nửa năm" chỉ làm người dùng
 * phải cân nhắc lâu hơn ở mỗi lần thêm việc.
 *
 * ─── Vì sao ghi chú nằm TRONG dòng việc ───
 * Mở một cửa sổ riêng để gõ ghi chú là ba cú bấm cho hai câu chữ, nên nó không
 * được dùng. Bung ngay dưới dòng việc thì nó rẻ tới mức người ta chịu gõ.
 */
import { useEffect, useRef, useState } from 'react';
import {
  AlarmClock, Bell, Check, ChevronDown, CornerDownRight, Flag, GripVertical,
  Plus, Repeat, StickyNote, Trash2, Volume2, VolumeX,
} from 'lucide-react';
import { dangBatAm, datBatAm, keuBoTick, keuThem, keuThu, keuXongHet, keuXongViec } from './amThanh';

export type Scope = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface Task {
  id: number | string;
  scope: Scope;
  date: string;
  title: string;
  done: boolean;
  exp: number;
  note?: string | null;
  dueAt?: string | null;
  remindAt?: string | null;
  priority?: number;
  repeat?: string;
  parentId?: number | null;
  sortOrder?: number;
}

export interface VaSua {
  done?: boolean;
  title?: string;
  note?: string | null;
  dueAt?: string | null;
  remindAt?: string | null;
  priority?: number;
  scope?: Scope;
  repeat?: string;
}

const PHAM_VI: Array<{ ma: Scope; ten: string; phu: string }> = [
  { ma: 'today', ten: 'Hôm nay', phu: 'việc phải xong trong ngày' },
  { ma: 'week', ten: 'Tuần này', phu: 'việc của cả tuần' },
  { ma: 'month', ten: 'Tháng này', phu: 'việc của cả tháng' },
  { ma: 'quarter', ten: 'Quý này', phu: 'mục tiêu vài tháng' },
  { ma: 'year', ten: 'Năm nay', phu: 'mục tiêu dài hạn' },
];

/** 0 = không đặt. Màu đi từ xám → vàng → cam → đỏ, đọc được mà không cần chú giải. */
const UU_TIEN = ['Không đặt', 'Thấp', 'Vừa', 'Cao'];

const NHIP_LAP: Array<{ ma: string; ten: string }> = [
  { ma: 'none', ten: 'Không lặp' },
  { ma: 'daily', ten: 'Hằng ngày' },
  { ma: 'weekly', ten: 'Hằng tuần' },
  { ma: 'monthly', ten: 'Hằng tháng' },
];

/** Còn bao lâu tới hạn, viết như người nói. `null` = không có hạn. */
export function conBaoLau(iso: string | null | undefined, bayGio = Date.now()): {
  chu: string; treZ: boolean; gap: boolean;
} | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const phut = Math.round((t - bayGio) / 60000);
  if (phut < 0) {
    const q = Math.abs(phut);
    if (q < 60) return { chu: `trễ ${q} phút`, treZ: true, gap: true };
    if (q < 1440) return { chu: `trễ ${Math.round(q / 60)} giờ`, treZ: true, gap: true };
    return { chu: `trễ ${Math.round(q / 1440)} ngày`, treZ: true, gap: true };
  }
  if (phut < 60) return { chu: `còn ${phut} phút`, treZ: false, gap: true };
  if (phut < 1440) return { chu: `còn ${Math.round(phut / 60)} giờ`, treZ: false, gap: phut < 240 };
  const ngay = Math.round(phut / 1440);
  return { chu: ngay === 1 ? 'ngày mai' : `còn ${ngay} ngày`, treZ: false, gap: false };
}

/** `Date` → chuỗi cho `<input type="datetime-local">`, THEO GIỜ MÁY. */
function choONhap(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  /* Phải bù lệch múi giờ bằng tay: `toISOString()` cho giờ UTC, mà
     `datetime-local` hiểu chuỗi nó nhận là GIỜ MÁY. Không bù thì người dùng
     đặt nhắc 21:00 và ô hiện 14:00 — sai đúng bằng múi giờ, mỗi lần mở lại. */
  const buLech = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return buLech.toISOString().slice(0, 16);
}

function DongViec({ t, con, onSua, onXoa, onThemCon, keo }: {
  t: Task;
  /** Việc con của nó. Rỗng với chính việc con — chỉ MỘT tầng. */
  con?: Task[];
  onSua: (t: Task, v: VaSua) => void;
  onXoa: (t: Task) => void;
  onThemCon?: (cha: Task, ten: string) => void;
  /** Bộ điều khiển kéo thả. Vắng ⇒ dòng này không kéo được (việc con). */
  keo?: {
    batDau: (id: Task['id']) => void;
    tren: (id: Task['id']) => void;
    tha: () => void;
    dangKeo: Task['id'] | null;
    dichVao: Task['id'] | null;
  };
}) {
  const [moGhiChu, datMoGhiChu] = useState(false);
  const [ghiChu, datGhiChu] = useState(t.note ?? '');
  const [ten, datTen] = useState(t.title);
  const [suaTen, datSuaTen] = useState(false);
  const [nhapCon, datNhapCon] = useState('');

  // Dữ liệu từ máy chủ về sau khi sửa ⇒ đồng bộ lại, nếu không ô vẫn giữ chữ cũ.
  useEffect(() => { datGhiChu(t.note ?? ''); }, [t.note]);
  useEffect(() => { datTen(t.title); }, [t.title]);

  const han = conBaoLau(t.dueAt);
  const uu = t.priority ?? 0;

  return (
    <li
      className="ct-viec"
      data-xong={t.done}
      data-uu={uu}
      data-con={con === undefined}
      data-dangkeo={keo?.dangKeo === t.id}
      data-dich={keo?.dichVao === t.id}
      draggable={keo !== undefined}
      onDragStart={() => keo?.batDau(t.id)}
      onDragOver={(e) => { if (keo) { e.preventDefault(); keo.tren(t.id); } }}
      onDragEnd={() => keo?.tha()}
      onDrop={(e) => { if (keo) { e.preventDefault(); keo.tha(); } }}
    >
      <div className="ct-viec-hang">
        {keo && (
          /* Tay cầm RIÊNG chứ không kéo cả dòng: cả dòng kéo được thì mọi lần
             bôi đen chữ để sửa đều biến thành một cú kéo hụt. */
          <span className="ct-viec-cam" aria-hidden><GripVertical size={13} /></span>
        )}
        <button
          type="button"
          className="ct-viec-tick"
          onClick={() => onSua(t, { done: !t.done })}
          aria-label={t.done ? 'Bỏ đánh dấu xong' : 'Đánh dấu xong'}
          title={t.done ? 'Bỏ đánh dấu' : 'Xong rồi!'}
        >
          <Check size={13} aria-hidden />
        </button>

        {suaTen ? (
          <input
            className="ct-viec-sua"
            value={ten}
            autoFocus
            onChange={(e) => datTen(e.target.value)}
            onBlur={() => {
              datSuaTen(false);
              const m = ten.trim();
              if (m && m !== t.title) onSua(t, { title: m }); else datTen(t.title);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { datTen(t.title); datSuaTen(false); }
            }}
          />
        ) : (
          /* Bấm vào chữ để sửa — không cần nút "sửa" riêng. Một dòng việc đã có
             bốn nút rồi; thêm nút thứ năm thì hàng nút dài hơn cả tên việc. */
          <button type="button" className="ct-viec-ten" onClick={() => datSuaTen(true)} title="Bấm để sửa">
            {t.title}
          </button>
        )}

        {han && (
          <span className="ct-viec-han" data-tre={han.treZ} data-gap={han.gap}>
            <AlarmClock size={11} aria-hidden /> {han.chu}
          </span>
        )}
        {(t.repeat ?? 'none') !== 'none' && (
          <span className="ct-viec-lap" title={NHIP_LAP.find((n) => n.ma === t.repeat)?.ten}>
            <Repeat size={11} aria-hidden />
          </span>
        )}
        {con && con.length > 0 && (
          <span className="ct-viec-demcon">{con.filter((c) => c.done).length}/{con.length}</span>
        )}
        {t.remindAt && <Bell size={11} aria-hidden className="ct-viec-chuong" />}
        {(t.note ?? '') !== '' && !moGhiChu && (
          <StickyNote size={11} aria-hidden className="ct-viec-cochu" />
        )}

        <span className="ct-viec-exp">+{t.exp}</span>

        <button type="button" className="ct-viec-nut" onClick={() => datMoGhiChu((v) => !v)}
          aria-label="Ghi chú và cài đặt" title="Ghi chú, hạn, nhắc">
          <ChevronDown size={13} aria-hidden style={{ transform: moGhiChu ? 'rotate(180deg)' : 'none' }} />
        </button>
        <button type="button" className="ct-viec-nut ct-viec-xoa" onClick={() => onXoa(t)}
          aria-label="Xoá việc" title="Xoá">
          <Trash2 size={13} aria-hidden />
        </button>
      </div>

      {moGhiChu && (
        <div className="ct-viec-mo">
          <textarea
            className="ct-viec-ghichu"
            value={ghiChu}
            rows={3}
            placeholder="Ghi chú cho việc này — bối cảnh, các bước, đường dẫn…"
            onChange={(e) => datGhiChu(e.target.value)}
            /* Lưu lúc RỜI ô, không phải mỗi phím: gõ một đoạn ghi chú là hàng
               trăm lần gọi máy chủ nếu lưu theo từng ký tự. */
            onBlur={() => { if (ghiChu !== (t.note ?? '')) onSua(t, { note: ghiChu }); }}
          />
          <div className="ct-viec-cai">
            <label>
              <Flag size={11} aria-hidden /> Ưu tiên
              <select value={uu} onChange={(e) => onSua(t, { priority: Number(e.target.value) })}>
                {UU_TIEN.map((u, i) => <option key={u} value={i}>{u}</option>)}
              </select>
            </label>
            <label>
              <AlarmClock size={11} aria-hidden /> Hạn
              <input type="datetime-local" value={choONhap(t.dueAt)}
                onChange={(e) => onSua(t, { dueAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </label>
            <label>
              <Repeat size={11} aria-hidden /> Lặp
              <select value={t.repeat ?? 'none'} onChange={(e) => onSua(t, { repeat: e.target.value })}>
                {NHIP_LAP.map((n) => <option key={n.ma} value={n.ma}>{n.ten}</option>)}
              </select>
            </label>
            <label>
              <Bell size={11} aria-hidden /> Nhắc lúc
              <input type="datetime-local" value={choONhap(t.remindAt)}
                onChange={(e) => onSua(t, { remindAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </label>
          </div>

          {onThemCon && (
            <div className="ct-viec-themcon">
              <CornerDownRight size={12} aria-hidden />
              <input
                value={nhapCon}
                placeholder="Thêm một bước nhỏ…"
                onChange={(e) => datNhapCon(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return; // bộ gõ tiếng Việt dùng Enter để chốt chữ
                  if (e.key !== 'Enter') return;
                  const m = nhapCon.trim();
                  if (!m) return;
                  onThemCon(t, m);
                  datNhapCon('');
                }}
              />
            </div>
          )}
        </div>
      )}

      {con && con.length > 0 && (
        <ul className="ct-viec-dscon">
          {con.map((c) => <DongViec key={c.id} t={c} onSua={onSua} onXoa={onXoa} />)}
        </ul>
      )}
    </li>
  );
}

export function BangViec({ tasks, pham, datPham, onThem, onSua, onXoa, onThemCon, onDoiThuTu }: {
  tasks: Task[];
  pham: Scope;
  datPham: (s: Scope) => void;
  onThem: (ten: string, s: Scope) => Promise<void>;
  onSua: (t: Task, v: VaSua) => void;
  onXoa: (t: Task) => void;
  onThemCon: (cha: Task, ten: string) => void;
  onDoiThuTu: (ids: Array<Task['id']>) => void;
}) {
  const [nhap, datNhap] = useState('');
  const [dangThem, datDangThem] = useState(false);
  const [coTieng, datCoTieng] = useState(dangBatAm());
  const oNhap = useRef<HTMLInputElement>(null);

  /* Kéo thả: giữ id đang kéo và id đang bị rê lên. Không dùng thư viện — HTML5
     drag đủ cho một danh sách phẳng, và một thư viện kéo thả là ~40KB cùng một
     mô hình sự kiện riêng phải học. */
  const [dangKeo, datDangKeo] = useState<Task['id'] | null>(null);
  const [dichVao, datDichVao] = useState<Task['id'] | null>(null);

  const cua = tasks.filter((t) => t.scope === pham);
  const xong = cua.filter((t) => t.done).length;
  const phanTram = cua.length === 0 ? 0 : Math.round((xong / cua.length) * 100);

  /* Chưa xong lên trước, rồi tới ưu tiên cao, rồi hạn gần. Việc đã xong tụt
     xuống đáy thay vì biến mất: nhìn thấy chúng là phần thưởng, và đó chính là
     thứ làm người ta muốn tick tiếp. */
  /* Chỉ việc CHA vào danh sách chính; việc con vẽ lồng trong cha của nó. */
  const cha = cua.filter((t) => t.parentId == null);
  const conCua = (id: Task['id']): Task[] => cua.filter((t) => t.parentId === id);

  const sapXep = [...cha].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    /* Thứ tự người dùng KÉO thắng mọi thứ khác — nếu ưu tiên vẫn thắng thì kéo
       xong nó nhảy về chỗ cũ, và người dùng kết luận kéo thả bị hỏng. */
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if ((b.priority ?? 0) !== (a.priority ?? 0)) return (b.priority ?? 0) - (a.priority ?? 0);
    const ha = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
    const hb = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
    return ha - hb;
  });

  const keo = {
    batDau: datDangKeo,
    tren: datDichVao,
    dangKeo,
    dichVao,
    tha: () => {
      if (dangKeo !== null && dichVao !== null && dangKeo !== dichVao) {
        const ids = sapXep.map((t) => t.id);
        const tu = ids.indexOf(dangKeo);
        const den = ids.indexOf(dichVao);
        if (tu >= 0 && den >= 0) {
          ids.splice(den, 0, ids.splice(tu, 1)[0]!);
          onDoiThuTu(ids);
        }
      }
      datDangKeo(null);
      datDichVao(null);
    },
  };

  const them = async () => {
    const ten = nhap.trim();
    if (!ten || dangThem) return;
    datDangThem(true);
    try {
      await onThem(ten, pham);
      datNhap('');
      keuThem();
      oNhap.current?.focus();
    } finally {
      datDangThem(false);
    }
  };

  const suaCoTieng = (t: Task, v: VaSua): void => {
    if (v.done !== undefined) {
      if (v.done) {
        // Việc cuối cùng ⇒ tiếng mừng dài, không phải tiếng tick thường.
        const conLai = cua.filter((x) => !x.done && x.id !== t.id).length;
        if (conLai === 0) keuXongHet(); else keuXongViec();
      } else {
        keuBoTick();
      }
    }
    onSua(t, v);
  };

  const mo = PHAM_VI.find((p) => p.ma === pham);

  return (
    <section className="ct-bangviec">
      <div className="ct-bangviec-tab" role="tablist" aria-label="Phạm vi kế hoạch">
        {PHAM_VI.map((p) => {
          const ds = tasks.filter((t) => t.scope === p.ma);
          const chuaXong = ds.filter((t) => !t.done).length;
          return (
            <button
              key={p.ma}
              type="button"
              role="tab"
              aria-selected={pham === p.ma}
              data-chon={pham === p.ma}
              onClick={() => datPham(p.ma)}
              title={p.phu}
            >
              {p.ten}
              {chuaXong > 0 && <span className="ct-bangviec-dem">{chuaXong}</span>}
            </button>
          );
        })}
      </div>

      <div className="ct-bangviec-tien">
        <button
          type="button"
          className="ct-bangviec-tieng"
          aria-pressed={coTieng}
          title={coTieng ? 'Đang bật tiếng — bấm để tắt' : 'Đang tắt tiếng — bấm để bật'}
          onClick={() => {
            const moi = !coTieng;
            datCoTieng(moi);
            datBatAm(moi);
            void window.cuongthai?.settings.set('tqAmThanh', moi);
            /* Kêu thử NGAY khi bật: đó là cách duy nhất người dùng biết tiếng
               đã bật mà không phải đi tick một việc thật để thử. */
            if (moi) keuThu();
          }}
        >
          {coTieng ? <Volume2 size={13} aria-hidden /> : <VolumeX size={13} aria-hidden />}
        </button>
        <div className="ct-bangviec-thanh"><div style={{ width: `${phanTram}%` }} /></div>
        <span>
          {cua.length === 0 ? mo?.phu : `${xong}/${cua.length} việc — ${phanTram}%`}
        </span>
      </div>

      <div className="ct-bangviec-them">
        <input
          ref={oNhap}
          value={nhap}
          onChange={(e) => datNhap(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void them(); }}
          placeholder={pham === 'today' ? 'Thêm một việc cho hôm nay…' : `Thêm mục tiêu cho ${mo?.ten.toLowerCase()}…`}
        />
        <button type="button" className="ct-btn ct-btn-chinh" onClick={() => void them()} disabled={dangThem || !nhap.trim()}>
          <Plus size={14} aria-hidden /> Thêm
        </button>
      </div>

      {sapXep.length === 0 ? (
        <p className="ct-bangviec-trong">
          Chưa có gì ở đây. Gõ vào ô trên để thêm việc đầu tiên
          {pham === 'today' ? ' cho hôm nay' : ''}.
        </p>
      ) : (
        <ul className="ct-bangviec-ds">
          {sapXep.map((t) => (
            <DongViec
              key={t.id}
              t={t}
              con={conCua(t.id)}
              onSua={suaCoTieng}
              onXoa={onXoa}
              onThemCon={onThemCon}
              keo={keo}
            />
          ))}
        </ul>
      )}

      {cua.length > 0 && xong === cua.length && (
        <p className="ct-bangviec-mung">
          <Check size={13} aria-hidden /> Xong hết rồi. Nghỉ một chút đi.
        </p>
      )}
    </section>
  );
}
