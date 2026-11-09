'use client';

/**
 * 👥 Cấp quyền xem Sách gốc / tài liệu gốc / file nghe (09/11/2026) — chỉ ADMIN thấy.
 * Người dùng: "bạn thân muốn học chung chỉ vài người thôi, mình mở khoá cho họ thấy sách và slide — chứ không phải
 * cho mượn tài khoản admin". Người được cấp chỉ xem được mục sách riêng, không có quyền admin nào khác.
 * Nút tự ẩn khi API trả 403 (không phải admin) — không cần đọc vai trò ở client.
 */
import { useCallback, useEffect, useState } from 'react';
import { Users, X, Search, Trash2, Plus } from 'lucide-react';
import api from '@/lib/api';
import cs from '@/components/sach-hoc/course.module.css';
import st from './capQuyen.module.css';

type Nguoi = { id: number; username: string; email: string | null; fullName: string | null; displayName: string | null; avatarUrl: string | null };
type Quyen = { id: number; userId: number; ghiChu: string | null; createdAt: string; user: Nguoi | null };

const ten = (n: Nguoi | null) => (n ? n.displayName || n.fullName || n.username : '(tài khoản đã xoá)');

export function NutCapQuyen() {
  const [laAdmin, setLaAdmin] = useState(false);
  const [mo, setMo] = useState(false);
  const [ds, setDs] = useState<Quyen[]>([]);
  const [tu, setTu] = useState('');
  const [kq, setKq] = useState<Nguoi[]>([]);
  const [ghiChu, setGhiChu] = useState('');
  const [loi, setLoi] = useState('');
  const [dangGui, setDangGui] = useState(false);

  const tai = useCallback(async () => {
    try {
      const r = await api.get('/sach-rieng/admin/quyen');
      setDs(r.data?.data ?? []);
      setLaAdmin(true);
    } catch { setLaAdmin(false); }
  }, []);
  useEffect(() => { tai(); }, [tai]);

  useEffect(() => {
    if (!mo || tu.trim().length < 2) { setKq([]); return; }
    const t = window.setTimeout(async () => {
      try { setKq((await api.get('/sach-rieng/admin/tim-nguoi', { params: { q: tu.trim() } })).data?.data ?? []); } catch { setKq([]); }
    }, 300);
    return () => window.clearTimeout(t);
  }, [tu, mo]);

  const cap = async (n: Nguoi) => {
    setDangGui(true); setLoi('');
    try {
      await api.post('/sach-rieng/admin/quyen', { userId: n.id, ghiChu: ghiChu.trim() || undefined });
      setTu(''); setKq([]); setGhiChu('');
      await tai();
    } catch { setLoi('Không cấp được quyền — thử lại.'); } finally { setDangGui(false); }
  };
  const thu = async (q: Quyen) => {
    if (!window.confirm(`Thu quyền xem sách của ${ten(q.user)}?`)) return;
    try { await api.delete(`/sach-rieng/admin/quyen/${q.userId}`); await tai(); } catch { setLoi('Không thu được quyền — thử lại.'); }
  };

  if (!laAdmin) return null;
  const daCo = new Set(ds.map((d) => d.userId));
  return (
    <>
      <button type="button" className={cs.iconBtn} onClick={() => setMo(true)} title="Cấp quyền xem sách cho bạn học">
        <Users size={16} /><span className={cs.btnLabel}>Cấp quyền ({ds.length})</span>
      </button>
      {mo && (
        <div className={st.nen} role="dialog" aria-modal="true" aria-label="Cấp quyền xem sách" onClick={(e) => { if (e.target === e.currentTarget) setMo(false); }}>
          <div className={st.hop}>
            <div className={st.dau}>
              <b>👥 Cấp quyền xem Sách gốc · tài liệu · file nghe</b>
              <button type="button" className={cs.iconBtn} onClick={() => setMo(false)} aria-label="Đóng"><X size={18} /></button>
            </div>
            <p className={st.ghi}>
              Người được cấp chỉ xem được <b>sách gốc, slide/tài liệu gốc của lớp và file nghe</b> — không có quyền quản trị nào khác.
              Đây là tài liệu có bản quyền: chỉ cấp cho bạn học cùng lớp, người đã có sách.
            </p>

            <div className={st.tim}>
              <Search size={15} aria-hidden />
              <input value={tu} onChange={(e) => setTu(e.target.value)} placeholder="Tìm theo tên đăng nhập, email, họ tên…" aria-label="Tìm tài khoản" />
            </div>
            <input className={st.oGhi} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (tuỳ chọn) — vd. bạn cùng lớp JPD123" maxLength={200} aria-label="Ghi chú" />
            {kq.length > 0 && (
              <ul className={st.ds}>
                {kq.map((n) => (
                  <li key={n.id} className={st.dong}>
                    <span className={st.nguoi}><b>{ten(n)}</b><small>@{n.username}{n.email ? ` · ${n.email}` : ''}</small></span>
                    {daCo.has(n.id)
                      ? <span className={st.daCap}>Đã cấp</span>
                      : <button type="button" className={cs.btn} disabled={dangGui} onClick={() => cap(n)}><Plus size={14} /> Cấp quyền</button>}
                  </li>
                ))}
              </ul>
            )}
            {loi && <p className={st.loi}>{loi}</p>}

            <div className={st.tieuDeDs}>Đang có quyền ({ds.length})</div>
            {ds.length === 0 ? <p className={st.ghi}>Chưa cấp cho ai — chỉ tài khoản quản trị xem được.</p> : (
              <ul className={st.ds}>
                {ds.map((q) => (
                  <li key={q.id} className={st.dong}>
                    <span className={st.nguoi}>
                      <b>{ten(q.user)}</b>
                      <small>{q.user ? `@${q.user.username}` : `#${q.userId}`} · cấp {new Date(q.createdAt).toLocaleDateString('vi-VN')}{q.ghiChu ? ` · ${q.ghiChu}` : ''}</small>
                    </span>
                    <button type="button" className={cs.btnGhost} onClick={() => thu(q)}><Trash2 size={14} /> Thu quyền</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
