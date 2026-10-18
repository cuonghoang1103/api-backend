/**
 * GỐC giao diện: (đợt 6) hỏi TIN THƯ MỤC lần đầu ⇒ mở phiên đã lưu ⇒ (chưa có thì) đăng nhập ⇒ khởi động lõi ⇒ chat.
 */
import { Box, useApp, useInput, useStdout } from 'ink';
import { Text } from './chu';
import { useEffect, useState } from 'react';
import type { CoDong } from '../coDong';
import type { KetNoiLoi } from '../ketNoi';
import type { KhoChat } from '../kho';
import { L } from '../i18n';
import { khoiDongPhien } from '../khoiDong';
import { THUONG_HIEU, mau, mo } from '../mau';
import { moLaiPhien, tenHienThi, type NguoiDung } from '../phien';
import { daTin, duongGon, ghiTin, laThuMucNhayCam } from '../tinThuMuc';
import { kieuVien } from '../kyTu';
import { THUONG_HIEU as TH, dam as damChu, mauInk } from '../mau';
import { SAO } from '../trangThai';
import { ManChat } from './ManChat';
import { ManDangNhap } from './ManDangNhap';

type Pha =
  /** Đợt 6: lần đầu mở ở thư mục này — hỏi có tin thư mục không (như Claude Code). */
  | { loai: 'tinCay' }
  | { loai: 'moLai' }
  | { loai: 'dangNhap'; nhacNho?: string }
  | { loai: 'khoiDong'; nguoi: NguoiDung; ngoaiTuyen: boolean }
  | { loai: 'chat'; kn: KetNoiLoi; kho: KhoChat; ngoaiTuyen: boolean; banMoi: string | null }
  | { loai: 'loi'; chu: string };

export function UngDung({ co, thuMuc, phienBan, chiDangNhap, banMoi, toanManHinh = false, onThoat }: {
  co: CoDong; thuMuc: string; phienBan: string; chiDangNhap: boolean; banMoi: Promise<string | null>;
  /** Đang ở alternate screen (main.tsx đã vào trước khi vẽ). */
  toanManHinh?: boolean;
  onThoat: (loiNhan?: string) => void;
}) {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [pha, setPha] = useState<Pha>(chiDangNhap ? { loai: 'dangNhap' } : daTin(thuMuc) ? { loai: 'moLai' } : { loai: 'tinCay' });
  const [nhip, setNhip] = useState(0);

  useEffect(() => {
    if (pha.loai !== 'moLai' && pha.loai !== 'khoiDong') return undefined;
    const h = setInterval(() => setNhip((n) => n + 1), 120);
    return () => clearInterval(h);
  }, [pha.loai]);

  useEffect(() => {
    if (pha.loai !== 'moLai') return;
    moLaiPhien().then(
      (r) => setPha(r ? { loai: 'khoiDong', nguoi: r.nguoi, ngoaiTuyen: r.ngoaiTuyen } : { loai: 'dangNhap' }),
      (e: Error) => setPha({ loai: 'loi', chu: e.message }),
    );
  }, [pha.loai]);

  useEffect(() => {
    if (pha.loai !== 'khoiDong') return;
    const { nguoi, ngoaiTuyen } = pha;
    void (async () => {
      try {
        const p = await khoiDongPhien(nguoi, co, thuMuc, phienBan);
        // Kiểm bản mới chạy song song từ lúc mở; chờ thêm tối đa 1,5s cho kịp in lên màn mở đầu.
        const moi = await Promise.race([banMoi, new Promise<null>((ok) => setTimeout(() => ok(null), 1500))]).catch(() => null);
        for (const c of p.canhBao) p.kho.thongBao(c, 'canh');
        setPha({ loai: 'chat', kn: p.kn, kho: p.kho, ngoaiTuyen, banMoi: moi });
      } catch (e) {
        setPha({ loai: 'loi', chu: L(`Không khởi động được lõi AI Code: ${(e as Error).message}`, `Could not start the AI Code core: ${(e as Error).message}`) });
      }
    })();
  }, [pha, co, thuMuc, phienBan, banMoi]);

  useEffect(() => {
    if (pha.loai !== 'loi') return;
    onThoat();
    const h = setTimeout(() => exit(new Error(pha.chu)), 50);
    return () => clearTimeout(h);
  }, [pha, exit, onThoat]);

  const rong = stdout.columns || 100;
  const sao = mau(THUONG_HIEU.tim)(SAO[nhip % SAO.length]!);
  switch (pha.loai) {
    case 'tinCay':
      return (
        <HopTinThuMuc
          thuMuc={thuMuc} rong={rong}
          onTin={() => { ghiTin(thuMuc); setPha({ loai: 'moLai' }); }}
          onThoat={() => { onThoat(L('Đã thoát — CuongMini không mở thư mục chưa được tin.', 'Exited — CuongMini does not open a folder you have not trusted.')); exit(); }}
        />
      );
    case 'moLai': return <Text>{`${sao} ${mo(L('Đang mở phiên đăng nhập…', 'Restoring your session…'))}`}</Text>;
    case 'khoiDong': return <Text>{`${sao} ${mo(L(`Xin chào ${tenHienThi(pha.nguoi)} — đang khởi động lõi AI Code…`, `Hi ${tenHienThi(pha.nguoi)} — starting the AI Code core…`))}`}</Text>;
    case 'dangNhap':
      return (
        <ManDangNhap
          rong={rong}
          nhacNho={pha.nhacNho}
          onXong={(n) => {
            if (chiDangNhap) { onThoat(L(`✓ Đã đăng nhập: ${tenHienThi(n)}. Gõ \`cuongmini\` để bắt đầu.`, `✓ Signed in as ${tenHienThi(n)}. Run \`cuongmini\` to start.`)); exit(); return; }
            setPha({ loai: 'khoiDong', nguoi: n, ngoaiTuyen: false });
          }}
          onHuy={() => { onThoat(L('Đã huỷ đăng nhập.', 'Sign-in cancelled.')); exit(); }}
        />
      );
    case 'chat':
      return (
        <ManChat
          kn={pha.kn} kho={pha.kho} thuMuc={thuMuc} phienBan={phienBan} cauHoiDau={co.cauHoi}
          banMoi={pha.banMoi} ngoaiTuyen={pha.ngoaiTuyen} chonViecCu={co.chonViecCu} onThoat={onThoat}
          toanManHinh={toanManHinh}
        />
      );
    case 'loi':
      return <Box><Text>{mau('#f87171')(`✗ ${pha.chu}`)}</Text></Box>;
  }
}

/**
 * Đợt 6 — HỘP TIN THƯ MỤC (như Claude Code): "Accessing workspace: <path>" + kiểm nhanh an toàn. 1 = tin (ghi nhớ),
 * 2 / Esc = thoát. Thư mục HOME / gốc ổ đĩa ⇒ cảnh báo đỏ, con trỏ mặc định ở "Không, thoát".
 */
export function HopTinThuMuc({ thuMuc, rong, onTin, onThoat }: { thuMuc: string; rong: number; onTin: () => void; onThoat: () => void }) {
  const nhayCam = laThuMucNhayCam(thuMuc);
  const [chon, setChon] = useState(nhayCam ? 1 : 0);
  const ds = [L('Có, tôi tin thư mục này', 'Yes, I trust this folder'), L('Không, thoát', 'No, exit')];
  useInput((input, key) => {
    if (key.upArrow || key.downArrow || key.tab) { setChon((c) => (c + 1) % 2); return; }
    if (input === '1') { onTin(); return; }
    if (input === '2' || key.escape || (key.ctrl && input === 'c')) { onThoat(); return; }
    if (key.return) { if (chon === 0) onTin(); else onThoat(); }
  });
  const w = Math.min(rong - 2, 100);
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(nhayCam ? '#f87171' : TH.tim)} flexDirection="column" paddingX={1} width={w}>
      <Text>{damChu(L('Mở thư mục làm việc:', 'Accessing workspace:'))}</Text>
      <Text>{mau(TH.timNhat)(duongGon(thuMuc))}</Text>
      <Box marginTop={1} flexDirection="column">
        {nhayCam ? (
          <Text>{mau('#f87171')(L(
            '⚠ Đây là thư mục HOME (hoặc gốc ổ đĩa) — CuongMini sẽ đọc, sửa và chạy lệnh được trên TOÀN BỘ dữ liệu cá nhân của bạn (khoá SSH, .env, tài liệu…). Nên mở đúng thư mục dự án: cd vào dự án rồi chạy cuongmini.',
            '⚠ This is your HOME folder (or a drive root) — CuongMini could read, edit and run commands across ALL your personal data (SSH keys, .env files, documents…). Prefer opening the project folder: cd into it, then run cuongmini.',
          ))}</Text>
        ) : (
          <Text>{L(
            'Kiểm nhanh an toàn: đây có phải dự án bạn tạo hoặc tin tưởng (code của bạn, dự án mã nguồn mở nổi tiếng, việc của nhóm)? Nếu không, hãy xem qua nội dung thư mục trước.',
            'Quick safety check: Is this a project you created or one you trust? (Like your own code, a well-known open source project, or work from your team). If not, take a moment to review what\'s in this folder first.',
          )}</Text>
        )}
        <Text>{mo(L('CuongMini sẽ đọc, sửa và chạy lệnh trong thư mục này (mỗi lần sửa/chạy vẫn hỏi theo chế độ quyền).', 'CuongMini will be able to read, edit and run commands here (edits/commands still ask per your permission mode).'))}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {ds.map((nhan, i) => (
          <Text key={nhan}>{i === chon ? mau(TH.timNhat)(damChu(`❯ ${i + 1}. ${nhan}`)) : `  ${mo(`${i + 1}.`)} ${nhan}`}</Text>
        ))}
      </Box>
      <Box marginTop={1}><Text>{mo(L('Enter xác nhận · Esc thoát · thư mục đã tin được nhớ (cả thư mục con)', 'Enter to confirm · Esc to exit · trusted folders are remembered (subfolders too)'))}</Text></Box>
    </Box>
  );
}
