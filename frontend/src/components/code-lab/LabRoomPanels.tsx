'use client';

/**
 * Bốn tấm của Phòng Lab, theo đúng thứ tự người học đi qua một bài:
 *
 *   GioiThieuBai   giảng đề trước khi gõ dòng đầu tiên
 *   TroGiang       chat kèm trong lúc làm — từng dòng, từng method, từng lớp
 *   NopBai         nộp .zip, AI chấm thay thầy và hỏi vặn
 *   HuongDanReview sau khi đạt: cách trình bày với thầy
 *
 * Cả bốn đều gọi Opus 4.8 qua cổng riêng, tức MỘT LƯỢT MẤT HÀNG CHỤC GIÂY. Nên
 * mỗi tấm phải nói rõ nó đang chạy và đang chạy CÁI GÌ — một spinner câm trong
 * 90 giây thì người dùng bấm lại, và lượt thứ hai vừa tốn tiền vừa không nhanh
 * hơn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, Bot, CheckCircle2, ClipboardCheck, FileUp, Loader2, RefreshCw,
  Send, Sparkles, Trash2, XCircle, Presentation,
} from 'lucide-react';
import { MermaidDiagram } from '@/components/exp-hub/MermaidDiagram';
import { codeLabApi } from '@/lib/code-lab-api';
import type { LabRoom, LabRoomChatTurn, LabRoomGuide, LabRoomIntro, LabRoomItem, LabRoomReview } from '@/types/code-lab';
import Markdown from '@/components/markdown/Markdown';

function loiCua(e: unknown, mac: string) {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message || mac;
}

function Khung({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4 sm:p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      {children}
    </div>
  );
}

function TieuDe({ icon, children, phu }: { icon: React.ReactNode; children: React.ReactNode; phu?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span style={{ color: 'var(--cl-accent, var(--accent-color))' }}>{icon}</span>
      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{children}</h3>
      <span className="ml-auto">{phu}</span>
    </div>
  );
}

function DangChay({ viec }: { viec: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-3 text-sm"
      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}>
      <Loader2 size={15} className="animate-spin" />
      <span>{viec} — model mạnh nhất, thường mất 30-90 giây. Cứ để yên trang này.</span>
    </div>
  );
}

function Loi({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border px-3 py-2 text-sm"
      style={{ borderColor: 'rgba(220,38,38,0.35)', background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
      <AlertTriangle size={15} className="mt-0.5 shrink-0" /> <span>{text}</span>
    </p>
  );
}

// ─── 1. Giới thiệu bài ──────────────────────────────────────────

export function GioiThieuBai({ roomId, item }: { roomId: number; item: LabRoomItem }) {
  const [data, setData] = useState<LabRoomIntro | null>(null);
  const [chay, setChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  const tai = useCallback(async (lamMoi = false) => {
    setChay(true); setLoi(null);
    try {
      const res = lamMoi
        ? await codeLabApi.regenLabRoomIntro(roomId, item.id)
        : await codeLabApi.labRoomIntro(roomId, item.id);
      setData(res.data.data);
    } catch (e) { setLoi(loiCua(e, 'Chưa soạn được phần giới thiệu.')); }
    finally { setChay(false); }
  }, [roomId, item.id]);

  useEffect(() => { setData(null); void tai(false); }, [tai]);

  return (
    <Khung>
      <TieuDe icon={<Sparkles size={16} />} phu={
        data && (
          <button onClick={() => void tai(true)} disabled={chay}
            className="inline-flex items-center gap-1 text-xs underline disabled:opacity-50" style={{ color: 'var(--text-muted)' }}>
            <RefreshCw size={12} /> soạn lại
          </button>
        )
      }>Giảng đề trước khi bạn gõ dòng đầu tiên</TieuDe>

      {chay && !data && <DangChay viec="Đang đọc đề và soạn bài giảng" />}
      {loi && <Loi text={loi} />}

      {data && (
        <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="leading-relaxed">{data.tongQuan}</p>

          <section>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Đề bắt buộc những gì</h4>
            <ul className="space-y-1">
              {(data.yeuCauBatBuoc || []).map((x, i) => (
                <li key={i} className="flex gap-2"><span style={{ color: 'var(--cl-accent, var(--accent-color))' }}>▸</span><span>{x}</span></li>
              ))}
            </ul>
          </section>

          {data.kienTruc && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Kiến trúc nên dùng</h4>
              <div className="space-y-1.5">
                {(data.kienTruc.tang || []).map((t, i) => (
                  <div key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--cl-accent, var(--accent-color))' }}>{t.goi}</span>
                    <span className="ml-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{t.file}</span>
                    <p className="mt-0.5">{t.viec}</p>
                  </div>
                ))}
              </div>
              {data.kienTruc.viSao && <p className="mt-2 italic leading-relaxed">{data.kienTruc.viSao}</p>}
            </section>
          )}

          {data.soDo && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Luồng chạy của chương trình</h4>
              <div className="overflow-x-auto rounded-xl border p-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                <MermaidDiagram chart={data.soDo} />
              </div>
            </section>
          )}

          {/* Với đề mà lõi là thuật toán, một bảng lần theo từng vòng trên ví dụ
              nhỏ dạy nhanh hơn mọi đoạn văn — người học thấy mảng đổi thật. */}
          {data.dienTien?.co && (data.dienTien.buoc || []).length > 0 && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Thuật toán chạy ra sao — lần theo <span className="font-mono normal-case">{data.dienTien.viDu}</span>
              </h4>
              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-xs">
                  <tbody>
                    {data.dienTien.buoc.map((b, i) => (
                      <tr key={i} style={{ borderTop: i ? '1px solid var(--border-color)' : undefined }}>
                        <td className="whitespace-nowrap px-3 py-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>{b.vong}</td>
                        <td className="whitespace-nowrap px-3 py-1.5 font-mono" style={{ color: 'var(--cl-accent, var(--accent-color))' }}>{b.trangThai}</td>
                        <td className="px-3 py-1.5">{b.giaiThich}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Làm theo thứ tự này</h4>
            <ol className="space-y-1">
              {(data.cacBuoc || []).map((x, i) => (
                <li key={i} className="flex gap-2"><span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span><span>{x}</span></li>
              ))}
            </ol>
          </section>

          {(data.boTest || []).length > 0 && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Tự chấm trước khi nộp — gõ gì, phải ra gì
              </h4>
              <div className="space-y-1.5">
                {(data.boTest || []).map((t, i) => (
                  <div key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <div className="flex flex-wrap items-start gap-x-2 gap-y-1 text-xs">
                      <span className="font-bold" style={{ color: 'var(--text-muted)' }}>GÕ</span>
                      <code className="whitespace-pre-wrap font-mono" style={{ color: 'var(--cl-accent, var(--accent-color))' }}>{t.go}</code>
                    </div>
                    <div className="mt-1 flex flex-wrap items-start gap-x-2 gap-y-1 text-xs">
                      <span className="font-bold" style={{ color: 'var(--text-muted)' }}>RA</span>
                      <code className="whitespace-pre-wrap font-mono">{t.cho}</code>
                    </div>
                    <p className="mt-1 text-xs italic" style={{ color: 'var(--text-muted)' }}>{t.viSao}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.khuonMau || []).length > 0 && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Khuôn mẫu thầy quen thấy</h4>
              <div className="space-y-1.5">
                {(data.khuonMau || []).map((k, i) => (
                  <div key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--cl-accent, var(--accent-color))' }}>{k.ten}</span>
                    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{k.vietSao}</pre>
                    <p className="mt-1 text-xs italic" style={{ color: 'var(--text-muted)' }}>{k.khiNao}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#d97706' }}>Bẫy của riêng đề này</h4>
            <ul className="space-y-1">
              {(data.bayCanTranh || []).map((x, i) => (
                <li key={i} className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} /><span>{x}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Thầy sẽ hỏi gì ở bài này</h4>
            <ul className="space-y-1">
              {(data.cauHoiVanDap || []).map((x, i) => <li key={i} className="flex gap-2"><span>❓</span><span>{x}</span></li>)}
            </ul>
          </section>
        </div>
      )}
    </Khung>
  );
}

// ─── 2. Trợ giảng ───────────────────────────────────────────────

const GOI_Y = [
  'Bắt đầu từ đâu? Liệt kê giúp mình các file cần tạo.',
  'Viết giúp mình lớp entity, có comment giải thích quyết định.',
  'Validator của bài này cần những hàm nào?',
  'Giải thích từng dòng của method vừa gợi ý.',
  'Vì sao bài này không cần tầng bo?',
];

export function TroGiang({ roomId, item }: { roomId: number; item: LabRoomItem }) {
  const [turns, setTurns] = useState<LabRoomChatTurn[]>([]);
  const [hoi, setHoi] = useState('');
  const [chay, setChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const cuoi = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTurns([]); setLoi(null);
    codeLabApi.labRoomChatHistory(roomId, item.id)
      .then((r) => setTurns(r.data.data || []))
      .catch(() => { /* phòng mới thì chưa có gì, không phải lỗi */ });
  }, [roomId, item.id]);

  useEffect(() => { cuoi.current?.scrollIntoView({ behavior: 'smooth' }); }, [turns, chay]);

  async function gui(text: string) {
    const q = text.trim();
    if (!q || chay) return;
    setHoi(''); setLoi(null); setChay(true);
    setTurns((cu) => [...cu, { role: 'user', content: q }]);
    try {
      const res = await codeLabApi.labRoomAsk(roomId, item.id, q);
      setTurns((cu) => [...cu, { role: 'assistant', content: res.data.data.answer }]);
    } catch (e) {
      setLoi(loiCua(e, 'AI chưa trả lời được. Thử hỏi lại giúp mình.'));
      setTurns((cu) => cu.slice(0, -1));
      setHoi(q);
    } finally { setChay(false); }
  }

  return (
    <Khung>
      <TieuDe icon={<Bot size={16} />} phu={
        turns.length > 0 && (
          <button
            onClick={async () => {
              if (!window.confirm('Xoá toàn bộ hội thoại của bài này?')) return;
              await codeLabApi.clearLabRoomChat(roomId, item.id);
              setTurns([]);
            }}
            className="inline-flex items-center gap-1 text-xs underline" style={{ color: 'var(--text-muted)' }}>
            <Trash2 size={12} /> xoá hội thoại
          </button>
        )
      }>Trợ giảng — hỏi bất cứ gì về bài này</TieuDe>

      <div className="mb-3 max-h-[52vh] space-y-3 overflow-y-auto pr-1">
        {turns.length === 0 && !chay && (
          <div className="rounded-xl border px-3 py-3 text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
            Trợ giảng đã đọc đề của bài này và bộ quy tắc của thầy. Hỏi thẳng: cần tạo file nào,
            method này viết sao, dòng này để làm gì, vì sao lại tách tầng như vậy.
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === 'user' ? 'flex justify-end' : ''}>
            <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm ${t.role === 'user' ? 'text-white' : ''}`}
              style={t.role === 'user'
                ? { background: 'var(--cl-accent, var(--accent-color))' }
                : { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              {t.role === 'user' ? <p className="whitespace-pre-wrap">{t.content}</p> : <Markdown mdx={t.content} />}
            </div>
          </div>
        ))}
        {chay && <DangChay viec="Trợ giảng đang soạn câu trả lời" />}
        <div ref={cuoi} />
      </div>

      {loi && <div className="mb-2"><Loi text={loi} /></div>}

      {turns.length === 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {GOI_Y.map((g) => (
            <button key={g} onClick={() => void gui(g)} disabled={chay}
              className="rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-[var(--bg-surface-hover)] disabled:opacity-50"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{g}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); void gui(hoi); }} className="flex items-end gap-2">
        <textarea
          value={hoi} onChange={(e) => setHoi(e.target.value)} rows={2} maxLength={4000}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void gui(hoi); } }}
          placeholder="Hỏi trợ giảng… (Ctrl/⌘ + Enter để gửi)"
          className="min-h-[44px] flex-1 resize-y rounded-xl border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
        />
        <button type="submit" disabled={chay || !hoi.trim()}
          className="inline-flex h-[44px] items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--cl-accent, var(--accent-color))' }}>
          {chay ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Gửi
        </button>
      </form>
    </Khung>
  );
}

// ─── 3. Nộp bài — AI chấm thay thầy ─────────────────────────────

const MAU_KET: Record<string, { nhan: string; mau: string }> = {
  dat: { nhan: 'Đạt', mau: '#22c55e' },
  thieu: { nhan: 'Thiếu', mau: '#d97706' },
  sai: { nhan: 'Sai', mau: '#dc2626' },
};

export function NopBai({ roomId, item, onXong }: { roomId: number; item: LabRoomItem; onXong: (p: LabRoom) => void }) {
  const [ketQua, setKetQua] = useState<LabRoomReview | null>(null);
  const [chay, setChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [tenFile, setTenFile] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  // Mở lại bài đã nộp thì hiện NGUYÊN bản nhận xét cũ. Chấm lại chỉ để có cùng
  // một nội dung là đốt một lượt Opus cho không.
  //
  // CHỈ chạy một lần cho mỗi bài (trang cha đã `key` theo item nên đổi bài là
  // remount). Cố ý KHÔNG đặt `item.coKetQuaCham` vào deps: nộp xong thì cờ đó
  // lật false→true, effect chạy lại, xoá trắng kết quả vừa hiện rồi tải lại
  // đúng nội dung đó — người dùng thấy màn hình nháy một cái vô cớ.
  const daTaiBanCu = useRef(false);
  useEffect(() => {
    if (daTaiBanCu.current || !item.coKetQuaCham) return;
    daTaiBanCu.current = true;
    codeLabApi.labRoomLastReview(roomId, item.id)
      .then((r) => setKetQua(r.data.data))
      .catch(() => { /* không đọc được bản cũ thì cứ để trống, nộp lại là có */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function nop(file: File) {
    setChay(true); setLoi(null); setTenFile(file.name);
    try {
      const res = await codeLabApi.submitLabRoomZip(roomId, item.id, file);
      setKetQua(res.data.data.ketQua);
      onXong(res.data.data.phong);
    } catch (e) { setLoi(loiCua(e, 'Chưa chấm được bài nộp.')); }
    finally { setChay(false); if (input.current) input.current.value = ''; }
  }

  return (
    <Khung>
      <TieuDe icon={<ClipboardCheck size={16} />}>Nộp project (.zip) — AI chấm thay thầy</TieuDe>

      <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Nén cả thư mục project NetBeans rồi tải lên. Xoá <code>build/</code> và <code>dist/</code> trước
        cho nhẹ. File chỉ nằm trong bộ nhớ, không lưu lại ở đâu.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input ref={input} type="file" accept=".zip,application/zip" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void nop(f); }} />
        <button onClick={() => input.current?.click()} disabled={chay}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'var(--cl-accent, var(--accent-color))' }}>
          {chay ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
          {item.coKetQuaCham ? 'Nộp lại' : 'Chọn file .zip'}
        </button>
        {tenFile && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{tenFile}</span>}
      </div>

      {chay && <DangChay viec="Đang đọc cả project và chấm theo đúng quy tắc của thầy" />}
      {loi && <Loi text={loi} />}

      {ketQua && (
        <div className="mt-4 space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-3"
            style={{
              borderColor: ketQua.dat ? 'rgba(34,197,94,0.4)' : 'rgba(217,119,6,0.4)',
              background: ketQua.dat ? 'rgba(34,197,94,0.08)' : 'rgba(217,119,6,0.08)',
            }}>
            {ketQua.dat ? <CheckCircle2 size={20} style={{ color: '#22c55e' }} /> : <XCircle size={20} style={{ color: '#d97706' }} />}
            <span className="font-bold" style={{ color: ketQua.dat ? '#22c55e' : '#d97706' }}>
              {ketQua.dat ? 'ĐẠT' : 'CHƯA ĐẠT'}
            </span>
            {ketQua.diem != null && <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{ketQua.diem}/10</span>}
            {ketQua.chay && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                biên dịch: {ketQua.chay.bienDichDuoc === true ? 'được' : ketQua.chay.bienDichDuoc === false ? 'KHÔNG' : 'chưa chắc'}
                {' · '}màn hình: {ketQua.chay.khopManHinh === 'khop' ? 'khớp' : ketQua.chay.khopManHinh === 'lech' ? 'LỆCH' : 'chưa chắc'}
              </span>
            )}
          </div>

          <p className="leading-relaxed">{ketQua.nhanXet}</p>

          {!!ketQua.thieuSoVoiDe?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#dc2626' }}>Thiếu so với đề</h4>
              <ul className="space-y-1">{ketQua.thieuSoVoiDe.map((x, i) => <li key={i} className="flex gap-2"><span>✗</span><span>{x}</span></li>)}</ul>
            </section>
          )}

          {!!ketQua.theoQuyTac?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Đối chiếu từng quy tắc</h4>
              <div className="space-y-1.5">
                {ketQua.theoQuyTac.map((r, i) => {
                  const m = MAU_KET[r.ket] || MAU_KET.sai!;
                  return (
                    <div key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: m.mau, background: `color-mix(in srgb, ${m.mau} 14%, transparent)` }}>{m.nhan}</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.muc}</span>
                        {r.file && <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.file}{r.dong ? `:${r.dong}` : ''}</span>}
                      </div>
                      <p className="mt-0.5">{r.chiTiet}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!!ketQua.hieuBaiKhong?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--cl-accent, var(--accent-color))' }}>
                Bạn có hiểu bài không — trả lời thử trước khi mở đáp án
              </h4>
              <div className="space-y-1.5">
                {ketQua.hieuBaiKhong.map((q, i) => (
                  <details key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <summary className="cursor-pointer font-semibold" style={{ color: 'var(--text-primary)' }}>{q.hoi}</summary>
                    <p className="mt-1.5 text-xs italic" style={{ color: 'var(--text-muted)' }}>Câu này kiểm: {q.viSao}</p>
                    <p className="mt-1">{q.traLoiTot}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {!!ketQua.phaiSuaTruocKhiNop?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#d97706' }}>Phải sửa trước khi nộp lại</h4>
              <ol className="space-y-1">
                {ketQua.phaiSuaTruocKhiNop.map((x, i) => (
                  <li key={i} className="flex gap-2"><span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span><span>{x}</span></li>
                ))}
              </ol>
            </section>
          )}

          {!!ketQua.diemManh?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#22c55e' }}>Làm tốt</h4>
              <ul className="space-y-1">{ketQua.diemManh.map((x, i) => <li key={i} className="flex gap-2"><span>✓</span><span>{x}</span></li>)}</ul>
            </section>
          )}
        </div>
      )}
    </Khung>
  );
}

// ─── 4. Hướng dẫn review với thầy ───────────────────────────────

export function HuongDanReview({ roomId, item }: { roomId: number; item: LabRoomItem }) {
  const [data, setData] = useState<LabRoomGuide | null>(null);
  const [chay, setChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  const tai = useCallback(async (lamMoi = false) => {
    setChay(true); setLoi(null);
    try {
      const res = lamMoi
        ? await codeLabApi.regenLabRoomGuide(roomId, item.id)
        : await codeLabApi.labRoomGuide(roomId, item.id);
      setData(res.data.data);
    } catch (e) { setLoi(loiCua(e, 'Chưa soạn được hướng dẫn.')); }
    finally { setChay(false); }
  }, [roomId, item.id]);

  useEffect(() => { setData(null); void tai(false); }, [tai]);

  return (
    <Khung>
      <TieuDe icon={<Presentation size={16} />} phu={
        data && (
          <button onClick={() => void tai(true)} disabled={chay}
            className="inline-flex items-center gap-1 text-xs underline disabled:opacity-50" style={{ color: 'var(--text-muted)' }}>
            <RefreshCw size={12} /> soạn lại
          </button>
        )
      }>Cách review với thầy cho chuyên nghiệp</TieuDe>

      {chay && !data && <DangChay viec="Đang soạn kịch bản trình bày" />}
      {loi && <Loi text={loi} />}

      {data && (
        <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <blockquote className="rounded-xl border-l-4 px-3 py-2 leading-relaxed"
            style={{ borderColor: 'var(--cl-accent, var(--accent-color))', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            “{data.moDau}”
          </blockquote>

          <section>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Trình bày theo thứ tự này</h4>
            <ol className="space-y-2">
              {(data.thuTuTrinhBay || []).map((b, i) => (
                <li key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--cl-accent, var(--accent-color))' }}>{i + 1}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.buoc}</span>
                    {b.moFileNao && <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>mở {b.moFileNao}</span>}
                  </div>
                  <p className="mt-1">“{b.noiGi}”</p>
                  {b.viSao && <p className="mt-1 text-xs italic" style={{ color: 'var(--text-muted)' }}>{b.viSao}</p>}
                </li>
              ))}
            </ol>
          </section>

          {!!data.chiVaoDau?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Thầy hỏi thì mở file nào</h4>
              <div className="space-y-1.5">
                {data.chiVaoDau.map((c, i) => (
                  <div key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{c.khiThayHoi}</p>
                    <p className="mt-0.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.moFileNao}</p>
                    <p className="mt-0.5">“{c.noiGi}”</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!!data.cauHoiChacChanBiHoi?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Chắc chắn bị hỏi</h4>
              <div className="space-y-1.5">
                {data.cauHoiChacChanBiHoi.map((q, i) => (
                  <details key={i} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                    <summary className="cursor-pointer font-semibold" style={{ color: 'var(--text-primary)' }}>{q.hoi}</summary>
                    <p className="mt-1">{q.traLoiNgan}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {!!data.dungLam?.length && (
            <section>
              <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#dc2626' }}>Đừng làm</h4>
              <ul className="space-y-1">{data.dungLam.map((x, i) => <li key={i} className="flex gap-2"><span>✗</span><span>{x}</span></li>)}</ul>
            </section>
          )}

          {data.chotHa && (
            <blockquote className="rounded-xl border-l-4 px-3 py-2 leading-relaxed"
              style={{ borderColor: '#22c55e', background: 'rgba(34,197,94,0.07)', color: 'var(--text-primary)' }}>
              “{data.chotHa}”
            </blockquote>
          )}
        </div>
      )}
    </Khung>
  );
}
