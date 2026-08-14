'use client';

/**
 * ============================================================
 * XƯỞNG GIỌNG — màn hình thu dữ liệu huấn luyện F5-TTS
 * ============================================================
 *
 * ⚠️ THIẾT KẾ CHO MỘT NGƯỜI NGỒI ĐÂY MỘT TIẾNG, KHÔNG PHẢI CHO ĐẸP.
 *
 * Gần hai trăm câu. Nếu mỗi câu phải đưa tay ra chuột bấm bốn lần thì
 * đó là tám trăm lần bấm, và người ta sẽ bỏ dở ở câu thứ sáu mươi. Nên
 * TOÀN BỘ vòng thu đi bằng bàn phím: Space thu/dừng, Enter nhận và sang
 * câu sau, R thu lại. Chuột chỉ để sửa chữ và nhảy câu.
 *
 * ── BA CÔNG TẮC TRÌNH DUYỆT PHẢI TẮT ──
 *
 * `echoCancellation`, `noiseSuppression`, `autoGainControl` — mặc định
 * BẬT hết, và cả ba đều là thuốc độc cho dữ liệu TTS:
 *
 * · Khử vọng và khử ồn được thiết kế cho cuộc gọi thoại: chúng cắt bớt
 *   phần đuôi hơi và phần rung, tức là đúng cái mà một model học ngữ
 *   điệu cần nghe.
 * · Tự động chỉnh âm lượng còn tệ hơn — nó làm MỖI ĐOẠN to nhỏ khác
 *   nhau tuỳ theo bạn ngồi gần hay xa lúc đó. Model học từ đó ra một
 *   giọng lúc to lúc nhỏ, đúng cái lỗi đã mất cả buổi để sửa ở loa robot.
 *
 * ⚠️ Và xin tắt KHÔNG có nghĩa là được tắt. Trình duyệt có quyền lờ đi.
 * Nên sau khi mở mic, màn hình ĐỌC LẠI `track.getSettings()` và hiện ra
 * cái thật sự đang chạy — theo đúng bài học "kiểm bộ kiểm trước khi tin
 * nó". Một dòng chữ "đã tắt" mà không đo thì vô giá trị.
 *
 * ── VÌ SAO ĐO PHÒNG TRƯỚC KHI THU ──
 *
 * Nền ồn là thứ không sửa được sau. Thu xong một trăm câu rồi mới biết
 * phòng có tiếng quạt thì cả trăm câu đó bỏ. Nên có nút đo ba giây im
 * lặng, chạy trước, mất mười giây và cứu cả buổi.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Check, ChevronLeft, ChevronRight, CircleDot, Download,
  Ear, Loader2, Mic, MicOff, Pencil, Plus, RefreshCw, Square, Trash2, Volume2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Cau {
  id: string;
  muc: string;
  tenMuc: string;
  dan: string;
  lamMau: boolean;
  chu: string;
  daThu?: boolean;
  chuSua?: string;
  do?: Do;
  /** Câu/mục do người dùng tự viết — xoá được, khác câu dựng sẵn. */
  tuThem?: boolean;
}

interface Do {
  giay: number;
  dinh?: number;
  rms?: number;
  chamTran?: number;
  snrDb?: number;
  catDauGiay?: number;
  catCuoiGiay?: number;
  canhBao: string[];
}

interface TienDo {
  soDoan: number;
  tongPhut: number;
  theoMuc: Record<string, { ten: string; xong: number; tong: number; giay: number }>;
  mocToiThieuPhut: number;
  mocTotPhut: number;
}

const BASE = '/admin/maker-lab/ha-tang/xuong';

/** So từng từ để chỉ ra chỗ đọc lệch. Bỏ dấu câu và hoa/thường. */
function chuanTu(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'()‘’“”]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Tỉ lệ từ khớp giữa kịch bản và cái Whisper nghe được. */
function doKhop(goc: string, nghe: string): number {
  const a = chuanTu(goc);
  const b = new Set(chuanTu(nghe));
  if (!a.length) return 1;
  return a.filter((t) => b.has(t)).length / a.length;
}

export function XuongGiong() {
  const [cau, setCau] = useState<Cau[]>([]);
  const [tienDo, setTienDo] = useState<TienDo | null>(null);
  const [viTri, setViTri] = useState(0);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState('');

  const [dangThu, setDangThu] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [muc, setMuc] = useState(0); // mức tiếng 0..1 để vẽ thanh
  const [dinhPhien, setDinhPhien] = useState(0); // đỉnh cao nhất trong lượt thu
  const [giayThu, setGiayThu] = useState(0);
  const [ketQua, setKetQua] = useState<{
    do: Do;
    nghe: string;
    /** Whisper có nhả ra một câu bịa không, và vì sao biết. Rỗng = không. */
    biaRa?: string;
    loiNghe?: string;
  } | null>(null);
  const [thietBi, setThietBi] = useState<MediaTrackSettings | null>(null);
  const [nenPhong, setNenPhong] = useState<{ rms: number; danh: string } | null>(null);
  const [dangDoPhong, setDangDoPhong] = useState(false);
  const [suaChu, setSuaChu] = useState<string | null>(null);
  /**
   * Chữ người dùng tự sửa, giữ NGAY TẠI MÁY.
   *
   * ⚠️ Phải sửa được TRƯỚC KHI THU, không chỉ sau.
   *
   * Mục tiếng miền Trung làm lộ ra chỗ này: mỗi vùng nói một khác, nên
   * người dùng cần nắn câu cho thuận miệng RỒI MỚI đọc. Mà đường lưu chữ
   * ở máy nhà đòi phải có đoạn thu trước đã (`if cid not in meta: 404`).
   *
   * Giữ ở localStorage thì sửa được lúc nào cũng được, sống qua cả lần
   * tải lại trang, và lúc thu thì gửi kèm — không phải đổi gì ở máy nhà.
   */
  const [suaCucBo, setSuaCucBo] = useState<Record<string, string>>({});

  // Khung "câu của tôi"
  const [moThem, setMoThem] = useState(false);
  const [cauMoi, setCauMoi] = useState('');
  const [mucDich, setMucDich] = useState('');
  const [tenMucMoi, setTenMucMoi] = useState('');
  const [danMucMoi, setDanMucMoi] = useState('');
  const [dangThem, setDangThem] = useState(false);

  // Soát lại toàn bộ
  const [dangSoat, setDangSoat] = useState(false);
  const [soatXong, setSoatXong] = useState(0);
  const [soatTong, setSoatTong] = useState(0);
  const [dangNgo, setDangNgo] = useState<
    Array<{ id: string; tenMuc: string; chu: string; nghe: string; khop: number | null; biaRa: string }>
  >([]);
  const dungSoat = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const batDauRef = useRef(0);
  const mienBanPhim = useRef(false);

  const hienTai = cau[viTri];

  /**
   * Chữ THẬT SỰ dùng cho câu này — ưu tiên bản sửa tại máy, rồi bản đã
   * lưu ở máy nhà, cuối cùng mới tới bản trong kịch bản.
   *
   * ⚠️ Phải dùng ở CẢ BA chỗ: hiện lên màn hình, gửi kèm lúc thu, và tính
   * % khớp. Lệch một chỗ là người dùng đọc câu A mà dữ liệu ghi câu B —
   * kiểu hỏng im lặng tệ nhất, vì nó không báo gì và chỉ lộ ra ở chất
   * lượng model sau nhiều giờ train.
   */
  const chuCuaCau = useCallback(
    (c: Cau) => suaCucBo[c.id] ?? c.chuSua ?? c.chu,
    [suaCucBo],
  );
  const chuDoc = hienTai ? chuCuaCau(hienTai) : '';

  // ── Nạp kịch bản ──────────────────────────────────────────
  const napLai = useCallback(async () => {
    try {
      const [kb, td] = await Promise.all([
        api.get(`${BASE}/kich-ban`),
        api.get(`${BASE}/tien-do`),
      ]);
      setCau(kb.data?.data?.cau ?? []);
      setTienDo(td.data?.data ?? null);
      setLoi('');
    } catch (e) {
      const m = e as { response?: { data?: { message?: string } }; message?: string };
      setLoi(m.response?.data?.message ?? m.message ?? 'Không gọi được máy nhà.');
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    void napLai();
    try {
      const s = localStorage.getItem('xuong-sua-chu');
      if (s) setSuaCucBo(JSON.parse(s) as Record<string, string>);
    } catch {
      /* localStorage hỏng thì mất bản sửa, không mất tiếng — đi tiếp. */
    }
  }, [napLai]);

  // Nhảy tới câu chưa thu đầu tiên — mở ra là làm tiếp được ngay, không
  // phải cuộn tìm chỗ dừng lần trước.
  const daNhay = useRef(false);
  useEffect(() => {
    if (daNhay.current || !cau.length) return;
    daNhay.current = true;
    const i = cau.findIndex((c) => !c.daThu);
    if (i > 0) setViTri(i);
  }, [cau]);

  // ── Mic ───────────────────────────────────────────────────
  const moMic = useCallback(async (): Promise<MediaStream> => {
    if (streamRef.current?.active) return streamRef.current;
    const s = await navigator.mediaDevices.getUserMedia({
      audio: {
        // Xem ghi chú đầu file — ba công tắc này phá dữ liệu TTS.
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
        sampleRate: 48_000,
      },
    });
    streamRef.current = s;
    // ĐỌC LẠI cái thật sự đang chạy, không tin cái vừa xin.
    setThietBi(s.getAudioTracks()[0]?.getSettings() ?? null);
    return s;
  }, []);

  /** Vẽ thanh mức + nhớ đỉnh. Dùng chung cho thu và đo phòng. */
  const batDauDo = useCallback((s: MediaStream, onMau?: (rms: number) => void) => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    acRef.current = ac;
    const src = ac.createMediaStreamSource(s);
    const an = ac.createAnalyser();
    an.fftSize = 1024;
    src.connect(an);
    const buf = new Float32Array(an.fftSize);
    const vong = () => {
      an.getFloatTimeDomainData(buf);
      let tong = 0;
      let dinh = 0;
      for (let i = 0; i < buf.length; i++) {
        tong += buf[i] * buf[i];
        const a = Math.abs(buf[i]);
        if (a > dinh) dinh = a;
      }
      const rms = Math.sqrt(tong / buf.length);
      setMuc(Math.min(1, dinh));
      setDinhPhien((d) => Math.max(d, dinh));
      onMau?.(rms);
      rafRef.current = requestAnimationFrame(vong);
    };
    vong();
  }, []);

  const dungDo = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    void acRef.current?.close();
    acRef.current = null;
    setMuc(0);
  }, []);

  // ── Đo phòng ──────────────────────────────────────────────
  const doPhong = useCallback(async () => {
    setDangDoPhong(true);
    setNenPhong(null);
    try {
      const s = await moMic();
      const mau: number[] = [];
      batDauDo(s, (rms) => mau.push(rms));
      await new Promise((r) => setTimeout(r, 3000));
      dungDo();
      mau.sort((a, b) => a - b);
      // Phân vị 50 chứ không phải trung bình: một tiếng động lẻ (cửa,
      // ho) kéo trung bình lên và biến một phòng yên thành phòng ồn.
      const nen = mau.length ? mau[Math.floor(mau.length / 2)] : 0;
      const danh =
        nen < 0.002 ? 'Rất yên — thu được' :
        nen < 0.006 ? 'Chấp nhận được' :
        nen < 0.015 ? 'Hơi ồn — tắt quạt/điều hoà nếu được' :
        'Ồn — thu ở đây sẽ hỏng dữ liệu';
      setNenPhong({ rms: nen, danh });
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không mở được mic.');
    } finally {
      setDangDoPhong(false);
    }
  }, [moMic, batDauDo, dungDo]);

  // ── Thu ───────────────────────────────────────────────────
  const dungThu = useCallback(() => {
    recRef.current?.state === 'recording' && recRef.current.stop();
  }, []);

  const batDauThu = useCallback(async () => {
    if (dangThu || dangGui || !hienTai) return;
    setKetQua(null);
    setDinhPhien(0);
    setGiayThu(0);
    try {
      const s = await moMic();
      const mieng: Blob[] = [];
      // Để trình duyệt tự chọn mã hoá: Chrome cho webm/opus, Safari cho
      // mp4/aac. ffmpeg ở máy nhà nhận cả hai, nên ép một kiểu chỉ tổ
      // làm hỏng trên một nửa số trình duyệt.
      const rec = new MediaRecorder(s);
      recRef.current = rec;
      rec.ondataavailable = (e) => e.data.size && mieng.push(e.data);
      rec.onstop = async () => {
        dungDo();
        setDangThu(false);
        const blob = new Blob(mieng, { type: rec.mimeType || 'audio/webm' });
        if (blob.size < 1000) {
          setLoi('Đoạn thu rỗng — bấm giữ lâu hơn một chút.');
          return;
        }
        setDangGui(true);
        try {
          const form = new FormData();
          form.append('tieng', blob, 'thu.webm');
          form.append('chu', chuCuaCau(hienTai));
          const r = await api.post(`${BASE}/cau/${encodeURIComponent(hienTai.id)}`, form, {
            timeout: 90_000,
          });
          const d = r.data?.data ?? {};
          setKetQua({ do: d.do, nghe: d.nghe ?? '', biaRa: d.biaRa, loiNghe: d.loiNghe });
          setCau((cs) =>
            cs.map((c) => (c.id === hienTai.id ? { ...c, daThu: true, do: d.do } : c)),
          );
          setLoi('');
        } catch (e) {
          const m = e as { response?: { data?: { message?: string } }; message?: string };
          setLoi(m.response?.data?.message ?? m.message ?? 'Gửi tiếng thất bại.');
        } finally {
          setDangGui(false);
        }
      };
      batDauDo(s);
      batDauRef.current = Date.now();
      rec.start();
      setDangThu(true);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không mở được mic.');
    }
  }, [dangThu, dangGui, hienTai, moMic, batDauDo, dungDo]);

  // Đồng hồ giây trong lúc thu
  useEffect(() => {
    if (!dangThu) return;
    const t = setInterval(() => setGiayThu((Date.now() - batDauRef.current) / 1000), 100);
    return () => clearInterval(t);
  }, [dangThu]);

  // Chốt chặn: quên bấm dừng thì tự dừng ở 25 giây. Không có nó, một lần
  // đi pha cà phê là một file tiếng dài mười phút và một lần chờ tải lên.
  useEffect(() => {
    if (dangThu && giayThu > 25) dungThu();
  }, [dangThu, giayThu, dungThu]);

  const sang = useCallback(
    (b: number) => {
      setViTri((v) => Math.max(0, Math.min(cau.length - 1, v + b)));
      setKetQua(null);
      setSuaChu(null);
    },
    [cau.length],
  );

  const xoaCau = useCallback(async () => {
    if (!hienTai) return;
    try {
      await api.delete(`${BASE}/cau/${encodeURIComponent(hienTai.id)}`);
      setCau((cs) => cs.map((c) => (c.id === hienTai.id ? { ...c, daThu: false, do: undefined } : c)));
      setKetQua(null);
      void napLai();
    } catch {
      setLoi('Không xoá được.');
    }
  }, [hienTai, napLai]);

  const luuChu = useCallback(
    async (chu: string) => {
      if (!hienTai || !chu.trim()) return;
      // Ghi tại máy TRƯỚC và luôn luôn: đây là bản người dùng sẽ đọc, và
      // nó phải tồn tại kể cả khi chưa thu câu nào.
      setSuaCucBo((m) => {
        const moi = { ...m, [hienTai.id]: chu.trim() };
        try {
          localStorage.setItem('xuong-sua-chu', JSON.stringify(moi));
        } catch {
          /* đầy quota — bản sửa vẫn dùng được trong phiên này */
        }
        return moi;
      });
      setSuaChu(null);
      // Đã thu rồi thì đẩy luôn lên máy nhà cho khớp; chưa thu thì lúc
      // thu sẽ gửi kèm.
      if (hienTai.daThu) {
        try {
          await api.put(`${BASE}/cau/${encodeURIComponent(hienTai.id)}/chu`, { chu: chu.trim() });
          setCau((cs) => cs.map((c) => (c.id === hienTai.id ? { ...c, chuSua: chu.trim() } : c)));
        } catch {
          setLoi('Đã sửa tại máy nhưng chưa đẩy lên được — thu lại câu này là khớp.');
        }
      }
    },
    [hienTai],
  );

  // ── Bàn phím ──────────────────────────────────────────────
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      // Đang gõ trong ô sửa chữ thì phím là phím, không phải lệnh.
      const t = e.target as HTMLElement;
      if (mienBanPhim.current || t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        dangThu ? dungThu() : void batDauThu();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!dangThu && !dangGui) {
          void napLai();
          sang(1);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (!dangThu && !dangGui) void batDauThu();
      } else if (e.key === 'ArrowLeft') sang(-1);
      else if (e.key === 'ArrowRight') sang(1);
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [dangThu, dangGui, batDauThu, dungThu, sang, napLai]);

  // Dọn mic khi rời trang — không dọn thì đèn mic trên máy sáng mãi.
  useEffect(
    () => () => {
      dungDo();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [dungDo],
  );

  // ── Tự thêm mục và câu ────────────────────────────────────
  //
  // Kịch bản dựng sẵn viết bằng tiếng phổ thông, cộng một mục miền Trung
  // chỉ gồm phần LÕI CHUNG. Nhưng miền Trung không phải một giọng, và
  // người viết kịch bản không biết người dùng nói kiểu nào — chỉ họ mới
  // biết. Đọc câu không phải giọng mình thì HẠI HƠN không đọc.
  const themCau = useCallback(
    async (muc: string, chu: string) => {
      const t = chu.trim();
      if (!t) return;
      try {
        await api.post(`${BASE}/them/cau`, { muc, chu: t });
        await napLai();
        setLoi('');
      } catch (e) {
        const m = e as { response?: { data?: { message?: string } } };
        setLoi(m.response?.data?.message ?? 'Không thêm được câu.');
      }
    },
    [napLai],
  );

  const themMuc = useCallback(
    async (ten: string, dan: string) => {
      const t = ten.trim();
      if (!t) return null;
      try {
        const r = await api.post(`${BASE}/them/muc`, { ten: t, dan: dan.trim(), lamMau: true });
        await napLai();
        setLoi('');
        return (r.data?.data?.khoa as string) ?? null;
      } catch (e) {
        const m = e as { response?: { data?: { message?: string } } };
        setLoi(m.response?.data?.message ?? 'Không tạo được mục.');
        return null;
      }
    },
    [napLai],
  );

  const xoaCauThem = useCallback(async () => {
    if (!hienTai?.tuThem) return;
    if (!confirm(`Xoá hẳn câu này khỏi kịch bản?\n\n"${chuDoc.slice(0, 80)}"`)) return;
    try {
      await api.delete(`${BASE}/them/cau/${encodeURIComponent(hienTai.id)}`);
      await napLai();
      setKetQua(null);
      setViTri((v) => Math.max(0, v - 1));
    } catch {
      setLoi('Không xoá được câu.');
    }
  }, [hienTai, chuDoc, napLai]);

  /**
   * Nghe lại TẤT CẢ đoạn đã thu và chấm khớp.
   *
   * ⚠️ Đây KHÔNG phải chấm điểm giọng. Whisper học tiếng phổ thông, nên
   * nó chấm thấp đúng những đoạn đọc đúng nhất — giọng miền Trung, đoạn
   * cười, đoạn gằn. Ngưỡng vì thế đặt RIÊNG theo từng mục ở backend, và
   * TẮT HẲN với tiếng miền Trung cùng mọi mục người dùng tự tạo.
   *
   * Kết quả chỉ để LỌC RA CHỖ ĐÁNG NGHE LẠI. Tai người dùng vẫn là chốt
   * cuối — nút phát nằm ngay cạnh.
   */
  const soatLai = useCallback(async () => {
    const ds = cau.filter((c) => c.daThu);
    if (!ds.length) return;
    dungSoat.current = false;
    setDangSoat(true);
    setSoatTong(ds.length);
    setSoatXong(0);
    setDangNgo([]);
    const ngo: typeof dangNgo = [];
    for (let i = 0; i < ds.length; i++) {
      if (dungSoat.current) break;
      const c = ds[i];
      try {
        const r = await api.post(
          `${BASE}/soat-lai/${encodeURIComponent(c.id)}`,
          { chu: chuCuaCau(c), muc: c.muc },
          { timeout: 60_000 },
        );
        const d = r.data?.data;
        if (d?.dangNgo || d?.biaRa) {
          ngo.push({
            id: c.id,
            tenMuc: c.tenMuc,
            chu: chuCuaCau(c),
            nghe: d.nghe ?? '',
            khop: d.khop ?? null,
            biaRa: d.biaRa ?? '',
          });
          setDangNgo([...ngo]);
        }
      } catch {
        /* một đoạn hỏng không được làm dừng cả lượt soát */
      }
      setSoatXong(i + 1);
    }
    setDangSoat(false);
    void napLai();
  }, [cau, chuCuaCau, napLai]);

  const xuat = useCallback(async () => {
    try {
      const r = await api.post(`${BASE}/xuat`, {});
      const d = r.data?.data;
      setLoi('');
      alert(
        `Xuất xong: ${d.soDoan} đoạn, ${d.tongPhut} phút.\n` +
          (d.boQua?.length ? `Bỏ qua ${d.boQua.length} đoạn.\n` : '') +
          `Thư mục: ${d.thuMuc}\n\n${d.buocTiep}`,
      );
    } catch (e) {
      const m = e as { response?: { data?: { message?: string } } };
      setLoi(m.response?.data?.message ?? 'Xuất thất bại.');
    }
  }, []);

  /**
   * % khớp giữa kịch bản và cái máy nghe được.
   *
   * ⚠️ Chỉ tính khi máy nghe ra một câu THẬT. Không có câu (máy bịa, hoặc
   * gọi hỏng) mà vẫn tính thì ra "khớp 0%" — một con số nghe như bạn đọc
   * sai bét, trong khi thật ra chưa ai soát cả.
   */
  const khop = useMemo(
    () => (ketQua?.nghe && !ketQua.biaRa && hienTai ? doKhop(chuDoc, ketQua.nghe) : null),
    [ketQua, hienTai],
  );

  const tuGoc = useMemo(() => chuanTu(chuDoc), [chuDoc]);
  const tuNghe = useMemo(() => new Set(ketQua ? chuanTu(ketQua.nghe) : []), [ketQua]);

  if (dangTai) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-primary)]">
          <Mic className="h-6 w-6 text-cyan-400" /> Xưởng giọng
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Thu giọng để huấn luyện F5-TTS. Nền tiếng Việt 1000 giờ đã sẵn sàng —
          phần còn thiếu là giọng của bạn.
        </p>
      </header>

      {loi && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loi}</span>
        </div>
      )}

      {/* ── Tiến độ ── */}
      {tienDo && (
        <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-3xl font-bold text-cyan-300">{tienDo.tongPhut}</span>
              <span className="ml-1 text-sm text-[var(--text-secondary)]">
                phút / {tienDo.soDoan} đoạn
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void napLai()}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-white/5"
              >
                <RefreshCw className="mr-1 inline h-3.5 w-3.5" /> Làm mới
              </button>
              <button
                onClick={() => (dangSoat ? (dungSoat.current = true) : void soatLai())}
                disabled={tienDo.soDoan === 0}
                className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300 hover:bg-amber-400/20 disabled:opacity-40"
              >
                {dangSoat ? (
                  <>
                    <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />
                    {soatXong}/{soatTong} — bấm để dừng
                  </>
                ) : (
                  <>
                    <Ear className="mr-1 inline h-3.5 w-3.5" /> Soát lại tất cả
                  </>
                )}
              </button>
              <button
                onClick={() => void xuat()}
                disabled={tienDo.tongPhut < 1}
                className="rounded-lg bg-cyan-500/90 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-40"
              >
                <Download className="mr-1 inline h-3.5 w-3.5" /> Xuất dataset
              </button>
            </div>
          </div>

          {/* Thanh mốc: 15 phút là ngưỡng bắt đầu ăn thua, 30 là chỗ tốt */}
          <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
              style={{ width: `${Math.min(100, (tienDo.tongPhut / tienDo.mocTotPhut) * 100)}%` }}
            />
            <div
              className="absolute top-0 h-full w-px bg-amber-400"
              style={{ left: `${(tienDo.mocToiThieuPhut / tienDo.mocTotPhut) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-[var(--text-secondary)]">
            <span>0</span>
            <span className="text-amber-400">{tienDo.mocToiThieuPhut}′ tối thiểu</span>
            <span className="text-emerald-400">{tienDo.mocTotPhut}′ tốt</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(tienDo.theoMuc).map(([k, v]) => (
              <button
                key={k}
                onClick={() => {
                  const i = cau.findIndex((c) => c.muc === k && !c.daThu);
                  setViTri(i >= 0 ? i : cau.findIndex((c) => c.muc === k));
                  setKetQua(null);
                }}
                className={`rounded-lg border px-2 py-1.5 text-left text-xs transition ${
                  hienTai?.muc === k
                    ? 'border-cyan-400/60 bg-cyan-400/10'
                    : 'border-white/10 hover:bg-white/5'
                }`}
              >
                <div className="truncate font-medium text-[var(--text-primary)]">{v.ten}</div>
                <div className="text-[var(--text-secondary)]">
                  {v.xong}/{v.tong} · {Math.round(v.giay)}s
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Đo phòng + trạng thái mic ── */}
      <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => void doPhong()}
            disabled={dangDoPhong || dangThu}
            className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300 hover:bg-amber-400/20 disabled:opacity-40"
          >
            {dangDoPhong ? (
              <>
                <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> Đang nghe phòng…
              </>
            ) : (
              <>
                <Ear className="mr-1 inline h-3.5 w-3.5" /> Đo phòng (3 giây im lặng)
              </>
            )}
          </button>
          {nenPhong && (
            <span
              className={`text-sm ${
                nenPhong.rms < 0.006 ? 'text-emerald-400' : nenPhong.rms < 0.015 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              Nền {nenPhong.rms.toFixed(4)} — {nenPhong.danh}
            </span>
          )}
        </div>

        {thietBi && (
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {([
              ['echoCancellation', 'khử vọng'],
              ['noiseSuppression', 'khử ồn'],
              ['autoGainControl', 'tự chỉnh âm'],
            ] as const).map(([k, ten]) => {
              const bat = (thietBi as unknown as Record<string, boolean | undefined>)[k];
              return (
                <span
                  key={k}
                  className={`rounded px-2 py-0.5 ${
                    bat ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {ten}: {bat ? 'CÒN BẬT ⚠' : 'đã tắt'}
                </span>
              );
            })}
            {thietBi.sampleRate && (
              <span className="rounded bg-white/10 px-2 py-0.5 text-[var(--text-secondary)]">
                {thietBi.sampleRate} Hz
              </span>
            )}
          </div>
        )}
      </section>

      {/* ── Câu hiện tại ── */}
      {hienTai && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded bg-cyan-400/15 px-2 py-0.5 font-medium text-cyan-300">
                {hienTai.tenMuc}
              </span>
              {hienTai.lamMau && (
                <span className="rounded bg-fuchsia-400/15 px-2 py-0.5 text-fuchsia-300">
                  dùng làm mẫu cảm xúc
                </span>
              )}
              <span className="text-[var(--text-secondary)]">
                {viTri + 1} / {cau.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => sang(-1)} className="rounded p-1.5 hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
              <button onClick={() => sang(1)} className="rounded p-1.5 hover:bg-white/10">
                <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* Lời dặn cách đọc — nhắc lại ở MỌI câu, vì đây là thứ người ta
              quên đầu tiên. */}
          <p className="mb-4 rounded-lg border-l-2 border-amber-400/60 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
            {hienTai.dan}
          </p>

          {/* Câu cần đọc — to, dễ đọc từ xa, vì người ta ngồi lùi khỏi mic */}
          {/* Tô đỏ từ lệch — chỉ khi máy nghe ra câu thật. Không có câu mà
              vẫn tô thì CẢ CÂU đỏ rực, trông như đọc sai hết. */}
          <p className="mb-5 text-2xl leading-relaxed text-[var(--text-primary)]">
            {tuGoc.length && khop != null
              ? chuDoc.split(/(\s+)/).map((t, i) => {
                  const sach = chuanTu(t)[0];
                  if (!sach) return <span key={i}>{t}</span>;
                  return (
                    <span key={i} className={tuNghe.has(sach) ? '' : 'bg-red-500/25 rounded px-0.5'}>
                      {t}
                    </span>
                  );
                })
              : chuDoc}
          </p>

          {/* Thanh mức tiếng */}
          <div className="mb-4">
            <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-[width] duration-75 ${
                  muc > 0.98 ? 'bg-red-500' : muc > 0.7 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${muc * 100}%` }}
              />
              {/* Vạch đỏ ở 98%: chạm vạch này là vỡ tiếng */}
              <div className="absolute top-0 h-full w-px bg-red-400/70" style={{ left: '98%' }} />
            </div>
            {dangThu && (
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-red-400">
                  <CircleDot className="mr-1 inline h-3 w-3 animate-pulse" />
                  {giayThu.toFixed(1)}s
                </span>
                <span className={dinhPhien > 0.98 ? 'text-red-400' : 'text-[var(--text-secondary)]'}>
                  đỉnh {(dinhPhien * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>

          {/* Nút */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => (dangThu ? dungThu() : void batDauThu())}
              disabled={dangGui}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-40 ${
                dangThu
                  ? 'bg-red-500 text-white hover:bg-red-400'
                  : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400'
              }`}
            >
              {dangGui ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi…
                </>
              ) : dangThu ? (
                <>
                  <Square className="h-4 w-4" /> Dừng
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Thu
                </>
              )}
              <kbd className="ml-1 rounded bg-black/20 px-1.5 text-[10px]">Space</kbd>
            </button>

            {hienTai.daThu && (
              <>
                <audio
                  key={`${hienTai.id}-${hienTai.do?.giay}`}
                  controls
                  className="h-9"
                  src={`/api/v1${BASE}/am/${encodeURIComponent(hienTai.id)}`}
                />
                <button
                  onClick={() => void xoaCau()}
                  title="Xoá đoạn thu"
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}

            {/* ⚠️ LUÔN HIỆN, không chờ khớp thấp.
                Bản đầu chỉ hiện nút này khi Whisper nghe lệch > 15%. Mục
                tiếng miền Trung phá vỡ giả định đó: Whisper nghe sai gần
                như luôn, và khi chốt chặn bắt được câu bịa thì KHÔNG có
                % khớp nào cả — nút biến mất đúng lúc cần nhất. Và quan
                trọng hơn: câu phải sửa được TRƯỚC khi đọc, chứ sửa sau
                thì đã đọc sai mất rồi. */}
            <button
              onClick={() => setSuaChu(chuDoc)}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5"
            >
              <Pencil className="mr-1 inline h-3.5 w-3.5" /> Sửa chữ
            </button>

            {hienTai.tuThem && (
              <button
                onClick={() => void xoaCauThem()}
                title="Xoá hẳn câu này khỏi kịch bản"
                className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300/80 hover:bg-red-400/10"
              >
                <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Xoá câu
              </button>
            )}

            <button
              onClick={() => {
                void napLai();
                sang(1);
              }}
              disabled={dangThu || dangGui}
              className="ml-auto rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-40"
            >
              <Check className="mr-1 inline h-4 w-4" /> Nhận & câu sau
              <kbd className="ml-2 rounded bg-black/20 px-1.5 text-[10px]">Enter</kbd>
            </button>
          </div>

          {/* Kết quả đo — SỐ THẬT, không phải chữ "đạt" */}
          {ketQua?.do && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                <span>
                  <Volume2 className="mr-1 inline h-3 w-3" />
                  {ketQua.do.giay}s
                </span>
                <span>đỉnh {ketQua.do.dinh}</span>
                <span>RMS {ketQua.do.rms}</span>
                <span className={(ketQua.do.chamTran ?? 0) > 0.2 ? 'text-red-400' : ''}>
                  chạm trần {ketQua.do.chamTran}%
                </span>
                <span className={(ketQua.do.snrDb ?? 99) < 25 ? 'text-amber-400' : 'text-emerald-400'}>
                  tiếng/nền {ketQua.do.snrDb} dB
                </span>
                {!!(ketQua.do.catDauGiay || ketQua.do.catCuoiGiay) && (
                  <span>
                    cắt lặng {ketQua.do.catDauGiay}s / {ketQua.do.catCuoiGiay}s
                  </span>
                )}
              </div>

              {ketQua.do.canhBao?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {ketQua.do.canhBao.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-amber-300">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}

              {/* Whisper nghe lại — người soát, không phải người sửa */}
              <div className="mt-3 border-t border-white/10 pt-2">
                {ketQua.loiNghe ? (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Không soát lại được ({ketQua.loiNghe}) — tiếng vẫn đã lưu.
                  </p>
                ) : ketQua.biaRa ? (
                  /**
                   * ⚠️ Whisper KHÔNG BAO GIỜ nói "tôi không nghe ra gì". Cho nó
                   * nghe tiếng ồn thì nó nhả ra thứ hay gặp nhất trong dữ liệu
                   * học, mà với tiếng Việt là phụ đề YouTube: "Hãy subscribe
                   * cho kênh Ghiền Mì Gõ…". Câu bịa nhìn tự tin y hệt câu thật.
                   *
                   * Nên ở đây KHÔNG hiện câu đó ra. Hiện nó lên là mời người
                   * dùng bấm "lấy câu máy nghe làm chuẩn" và nhét một câu rác
                   * vào dữ liệu huấn luyện.
                   */
                  <div className="text-xs">
                    <span className="text-amber-300">
                      <AlertTriangle className="mr-1 inline h-3 w-3" />
                      Máy không nghe ra ({ketQua.biaRa}) — đã chặn câu bịa.
                    </span>
                    <p className="mt-1 text-[var(--text-secondary)]">
                      Tiếng vẫn lưu bình thường và vẫn dùng để train, vì chữ lấy
                      từ kịch bản chứ không lấy từ máy. Chỉ là lần này không soát
                      hộ được — nghe lại ở nút phát để tự kiểm.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[var(--text-secondary)]">Máy nghe được:</span>
                      {khop != null && (
                        <span
                          className={
                            khop > 0.85 ? 'text-emerald-400' : khop > 0.6 ? 'text-amber-400' : 'text-red-400'
                          }
                        >
                          khớp {(khop * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-primary)]">{ketQua.nghe || '(không nghe ra)'}</p>
                    {khop != null && khop < 0.85 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => void batDauThu()}
                          className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                        >
                          Đọc lại <kbd className="ml-1 rounded bg-black/20 px-1 text-[10px]">R</kbd>
                        </button>
                        <button
                          onClick={() => void luuChu(ketQua.nghe)}
                          className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                        >
                          Lấy câu máy nghe làm chuẩn
                        </button>
                        <button
                          onClick={() => setSuaChu(chuDoc)}
                          className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                        >
                          Sửa tay
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {suaChu !== null && (
            <div className="mt-3">
              <textarea
                value={suaChu}
                onChange={(e) => setSuaChu(e.target.value)}
                onFocus={() => (mienBanPhim.current = true)}
                onBlur={() => (mienBanPhim.current = false)}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
              />
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => void luuChu(suaChu)}
                  className="rounded bg-cyan-500 px-3 py-1 text-xs font-medium text-slate-900"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setSuaChu(null)}
                  className="rounded border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]"
                >
                  Bỏ
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══ Kết quả soát ══ */}
      {(dangSoat || dangNgo.length > 0 || soatXong > 0) && (
        <section className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/[0.04] p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-[var(--text-primary)]">
              Soát lại — {soatXong}/{soatTong} đoạn
            </span>
            {!dangSoat && (
              <span className={dangNgo.length ? 'text-sm text-amber-300' : 'text-sm text-emerald-400'}>
                {dangNgo.length ? `${dangNgo.length} đoạn nên nghe lại` : 'Không có đoạn nào đáng ngờ ✓'}
              </span>
            )}
          </div>

          {/* ⚠️ Nói rõ giới hạn NGAY TẠI CHỖ đọc kết quả, không giấu trong
              tài liệu. Một danh sách "đáng ngờ" mà không kèm câu này sẽ
              được đọc như một bảng điểm, và người dùng sẽ thu lại đúng
              những đoạn hay nhất. */}
          <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">
            Đây <strong>không phải điểm giọng</strong>. Nó chỉ đo Whisper có nghe ra
            cùng bộ từ hay không — mà Whisper học tiếng phổ thông, nên chấm thấp
            đúng lúc bạn đọc hay nhất. Ngưỡng đã hạ riêng cho mục cười và mục cảm
            xúc, và <strong>tắt hẳn</strong> cho tiếng miền Trung cùng mọi mục bạn
            tự tạo. Nghe lại rồi tự quyết — tai bạn đúng hơn nó.
          </p>

          {dangNgo.length > 0 && (
            <ul className="space-y-2">
              {dangNgo.map((d) => (
                <li key={d.id} className="rounded-lg border border-white/10 bg-black/20 p-2.5">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => {
                        const i = cau.findIndex((c) => c.id === d.id);
                        if (i >= 0) {
                          setViTri(i);
                          setKetQua(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="rounded bg-cyan-400/15 px-2 py-0.5 font-medium text-cyan-300 hover:bg-cyan-400/25"
                    >
                      {d.tenMuc} · tới câu này →
                    </button>
                    {d.biaRa ? (
                      <span className="text-amber-300">máy không nghe ra ({d.biaRa})</span>
                    ) : (
                      <span className="text-amber-300">khớp {((d.khop ?? 0) * 100).toFixed(0)}%</span>
                    )}
                    <audio
                      controls
                      className="ml-auto h-7"
                      src={`/api/v1${BASE}/am/${encodeURIComponent(d.id)}`}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-primary)]">{d.chu}</p>
                  {d.nghe && (
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      máy nghe: {d.nghe}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ══ Câu của tôi ══ */}
      <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <button
          onClick={() => {
            setMoThem((v) => !v);
            if (!mucDich && hienTai) setMucDich(hienTai.muc);
          }}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
            <Plus className="h-4 w-4 text-cyan-400" /> Câu của tôi
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {moThem ? 'thu gọn' : 'mở ra'}
          </span>
        </button>

        {moThem && (
          <div className="mt-4 space-y-5">
            <p className="rounded-lg border-l-2 border-cyan-400/60 bg-cyan-400/5 px-3 py-2 text-xs leading-relaxed text-[var(--text-secondary)]">
              Kịch bản dựng sẵn viết bằng tiếng phổ thông, và mục miền Trung chỉ có
              phần <strong>lõi chung</strong> (mô, tê, răng, rứa, chi, ni, nớ). Quê
              bạn nói kiểu nào thì chỉ bạn biết — viết vào đây.
              <br />
              <strong className="text-amber-300">
                Đọc một câu không phải giọng mình còn hại hơn không đọc
              </strong>{' '}
              — nó dạy model một giọng lai. Nên cứ sửa hoặc bỏ câu nào nghe không
              thuận miệng.
            </p>

            {/* Thêm câu vào một mục */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
                Thêm câu vào mục
              </label>
              <select
                value={mucDich}
                onChange={(e) => setMucDich(e.target.value)}
                className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
              >
                {tienDo &&
                  Object.entries(tienDo.theoMuc).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.ten} ({v.xong}/{v.tong})
                    </option>
                  ))}
              </select>
              <textarea
                value={cauMoi}
                onChange={(e) => setCauMoi(e.target.value)}
                onFocus={() => (mienBanPhim.current = true)}
                onBlur={() => (mienBanPhim.current = false)}
                rows={5}
                placeholder={
                  'Mỗi dòng một câu — dán cả chục câu một lúc cũng được.\n\n' +
                  'Đi mô rứa?\n' +
                  'Nỏ biết mô, để tui hỏi lại đã.\n' +
                  'Mần chi mà lâu rứa hè?'
                }
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  disabled={dangThem || !cauMoi.trim() || !mucDich}
                  onClick={async () => {
                    // ⚠️ Thêm TUẦN TỰ, không Promise.all: id sinh từ một bộ
                    // đếm ở máy nhà, gửi song song là hai câu cùng xin một số.
                    setDangThem(true);
                    const ds = cauMoi
                      .split('\n')
                      .map((x) => x.trim())
                      .filter(Boolean);
                    for (const c of ds) await themCau(mucDich, c);
                    setCauMoi('');
                    setDangThem(false);
                  }}
                  className="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-40"
                >
                  {dangThem ? (
                    <>
                      <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> Đang thêm…
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1 inline h-3.5 w-3.5" /> Thêm{' '}
                      {cauMoi.split('\n').filter((x) => x.trim()).length || 0} câu
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tạo mục mới */}
            <div className="border-t border-white/10 pt-4">
              <label className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
                Hoặc tạo mục mới của riêng bạn
              </label>
              <input
                value={tenMucMoi}
                onChange={(e) => setTenMucMoi(e.target.value)}
                onFocus={() => (mienBanPhim.current = true)}
                onBlur={() => (mienBanPhim.current = false)}
                placeholder="Tên mục — ví dụ: Giọng Nghệ Tĩnh, Nói với mẹ, Chửi yêu…"
                className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
              />
              <textarea
                value={danMucMoi}
                onChange={(e) => setDanMucMoi(e.target.value)}
                onFocus={() => (mienBanPhim.current = true)}
                onBlur={() => (mienBanPhim.current = false)}
                rows={2}
                placeholder="Lời dặn cách đọc — hiện to lúc thu để bạn khỏi quên. Ví dụ: nói nhanh, giọng cao, kiểu đang trêu."
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)]"
              />
              <button
                disabled={dangThem || !tenMucMoi.trim()}
                onClick={async () => {
                  setDangThem(true);
                  const k = await themMuc(tenMucMoi, danMucMoi);
                  if (k) {
                    setMucDich(k);
                    setTenMucMoi('');
                    setDanMucMoi('');
                  }
                  setDangThem(false);
                }}
                className="mt-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-white/5 disabled:opacity-40"
              >
                <Plus className="mr-1 inline h-3.5 w-3.5" /> Tạo mục
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="mt-4 text-center text-xs text-[var(--text-secondary)]">
        <kbd className="rounded bg-white/10 px-1.5">Space</kbd> thu/dừng ·{' '}
        <kbd className="rounded bg-white/10 px-1.5">Enter</kbd> nhận &amp; câu sau ·{' '}
        <kbd className="rounded bg-white/10 px-1.5">R</kbd> đọc lại ·{' '}
        <kbd className="rounded bg-white/10 px-1.5">←→</kbd> chuyển câu
      </p>

      {!streamRef.current && (
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-[var(--text-secondary)]">
          <MicOff className="h-3 w-3" /> Trình duyệt sẽ hỏi quyền dùng mic ở lần thu đầu tiên.
        </p>
      )}
    </div>
  );
}
