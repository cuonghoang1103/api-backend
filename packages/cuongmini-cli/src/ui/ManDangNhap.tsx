/**
 * MÀN ĐĂNG NHẬP — hai đường y như app/extension (`cuongmini-core/src/dangNhap.ts`):
 *  • Google / GitHub / Apple: mở trình duyệt hệ thống, web trả token về cổng
 *    vòng 127.0.0.1 (RFC 8252). Không tự mở được trình duyệt (SSH, máy chủ…)
 *    thì in link để người dùng tự mở.
 *  • Tên đăng nhập + mật khẩu: ô mật khẩu KHÔNG hiện ký tự, xoá khỏi bộ nhớ
 *    ngay sau khi gửi.
 */
import { Box, useInput } from 'ink';
import { Text } from './chu';
import { kieuVien } from '../kyTu';
import { useEffect, useRef, useState } from 'react';
import { dangNhapMatKhau, dangNhapTrinhDuyet, huyDangNhapTrinhDuyet } from '../../../cuongmini-core/src/dangNhap';
import { moNgoai } from '../heThong';
import { veLogo } from '../logo';
import { THUONG_HIEU, dam, mau, mauInk, mo } from '../mau';
import { L } from '../i18n';
import { luuPhien, type NguoiDung } from '../phien';
import { MenuView, ONhapNho } from './thanhPhan';

type Buoc = 'chon' | 'trinhDuyet' | 'ten' | 'matKhau' | 'dang';

const LUA_CHON = [
  { giaTri: 'google', get nhan() { return L('Tiếp tục với Google', 'Continue with Google'); } },
  { giaTri: 'github', get nhan() { return L('Tiếp tục với GitHub', 'Continue with GitHub'); } },
  { giaTri: 'apple', get nhan() { return L('Tiếp tục với Apple', 'Continue with Apple'); } },
  { giaTri: 'matKhau', get nhan() { return L('Tên đăng nhập + mật khẩu', 'Username + password'); } },
  { giaTri: 'thoat', get nhan() { return L('Thoát', 'Quit'); } },
] as const;

export function ManDangNhap({ rong, nhacNho, onXong, onHuy }: {
  rong: number; nhacNho?: string; onXong: (n: NguoiDung) => void; onHuy: () => void;
}) {
  const [buoc, setBuoc] = useState<Buoc>('chon');
  const [chon, setChon] = useState(0);
  const [ten, setTen] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loi, setLoi] = useState(nhacNho ?? '');
  const [url, setUrl] = useState('');
  const [moDuoc, setMoDuoc] = useState(true);
  const conSong = useRef(true);
  useEffect(() => () => { conSong.current = false; huyDangNhapTrinhDuyet(); }, []);

  const xong = (n: NguoiDung) => {
    luuPhien(n);
    if (conSong.current) onXong(n);
  };

  const trinhDuyet = (nha: 'google' | 'github' | 'apple') => {
    setBuoc('trinhDuyet');
    setLoi('');
    setUrl('');
    dangNhapTrinhDuyet(nha, async (u) => {
      setUrl(u);
      const ok = await moNgoai(u);
      setMoDuoc(ok);
      // Không mở được trình duyệt: VẪN chờ — người dùng tự mở link đang in trên màn hình.
      return true;
    }, 'terminal').then(xong, (e: Error) => {
      if (!conSong.current) return;
      setBuoc('chon');
      setLoi(e.message);
    });
  };

  const matKhauGui = () => {
    const mk = matKhau;
    setMatKhau('');
    setBuoc('dang');
    dangNhapMatKhau(ten.trim(), mk).then(xong, (e: Error) => {
      if (!conSong.current) return;
      setBuoc('matKhau');
      setLoi(e.message);
    });
  };

  useInput((input, key) => {
    if (buoc === 'chon') {
      if (key.upArrow) setChon((c) => (c - 1 + LUA_CHON.length) % LUA_CHON.length);
      else if (key.downArrow || key.tab) setChon((c) => (c + 1) % LUA_CHON.length);
      else if (key.escape || (key.ctrl && input === 'c')) onHuy();
      else if (key.return || /^[1-5]$/.test(input)) {
        const i = key.return ? chon : Number(input) - 1;
        const m = LUA_CHON[i]!;
        setChon(i);
        if (m.giaTri === 'thoat') onHuy();
        else if (m.giaTri === 'matKhau') { setLoi(''); setBuoc('ten'); }
        else trinhDuyet(m.giaTri);
      }
      return;
    }
    if (buoc === 'trinhDuyet') {
      if (key.escape || (key.ctrl && input === 'c')) { huyDangNhapTrinhDuyet(); setBuoc('chon'); }
      return;
    }
    if (buoc === 'ten' || buoc === 'matKhau') {
      if (key.escape || (key.ctrl && input === 'c')) { setMatKhau(''); setBuoc('chon'); return; }
      const dat = buoc === 'ten' ? setTen : setMatKhau;
      if (key.return) {
        if (buoc === 'ten') { if (ten.trim()) setBuoc('matKhau'); }
        else if (matKhau) matKhauGui();
        return;
      }
      if (key.tab && buoc === 'ten' && ten.trim()) { setBuoc('matKhau'); return; }
      if (key.backspace || key.delete) { dat((v) => [...v].slice(0, -1).join('')); return; }
      if (key.ctrl && input === 'u') { dat(''); return; }
      if (input && !key.ctrl && !key.meta) dat((v) => v + input.replace(/[\r\n]/g, ''));
    }
  });

  const logo = veLogo(Math.min(rong - 4, 80));
  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text>{logo.join('\n')}</Text>
      </Box>
      <Text>{`${dam(L('Đăng nhập tài khoản cuongthai.com', 'Sign in with your cuongthai.com account'))} ${mo(L('để dùng CuongMini — lõi AI Code của CuongThai, ngay trong terminal.', 'to use CuongMini — the CuongThai AI Code core, right in your terminal.'))}`}</Text>
      {loi ? <Box marginTop={1}><Text>{mau('#f87171')(`✕ ${loi}`)}</Text></Box> : null}
      {buoc === 'chon' ? (
        <MenuView tieuDe={L('Chọn cách đăng nhập', 'Choose how to sign in')} ds={LUA_CHON.map((l) => ({ nhan: l.nhan, giaTri: l.giaTri as string }))} chon={chon} loc="" coLoc={false} rong={Math.min(rong - 2, 70)} />
      ) : null}
      {buoc === 'trinhDuyet' ? (
        <Box borderStyle={kieuVien()} borderColor={mauInk(THUONG_HIEU.tim)} flexDirection="column" paddingX={1} marginTop={1} width={Math.min(rong - 2, 100)}>
          <Text>{`${mau(THUONG_HIEU.timNhat)('◐')} ${moDuoc ? L('Đã mở trình duyệt — đăng nhập xong sẽ tự quay lại đây…', 'Opened your browser — you\'ll come back here once signed in…') : L('Không tự mở được trình duyệt. Mở link dưới đây bằng tay:', 'Could not open a browser. Open this link manually:')}`}</Text>
          {url ? <Box marginTop={1}><Text>{`${mo('Link:')} ${mau('#e08a63')(url)}`}</Text></Box> : null}
          <Text>{mo(L('Esc để huỷ · tự huỷ sau 5 phút', 'Esc to cancel · times out after 5 minutes'))}</Text>
        </Box>
      ) : null}
      {buoc === 'ten' || buoc === 'matKhau' || buoc === 'dang' ? (
        <Box borderStyle={kieuVien()} borderColor={mauInk(THUONG_HIEU.tim)} flexDirection="column" paddingX={1} marginTop={1} width={Math.min(rong - 2, 70)}>
          <ONhapNho nhan={L('Tên / email', 'User / email')} giaTri={ten} dangNhap={buoc === 'ten'} />
          <ONhapNho nhan={L('Mật khẩu', 'Password')} giaTri={buoc === 'dang' ? '••••••' : matKhau} an dangNhap={buoc === 'matKhau'} />
          <Box marginTop={1}><Text>{buoc === 'dang' ? mau(THUONG_HIEU.timNhat)(L('Đang đăng nhập…', 'Signing in…')) : mo(L('Enter tiếp tục · Esc quay lại', 'Enter to continue · Esc to go back'))}</Text></Box>
        </Box>
      ) : null}
      <Box marginTop={1}><Text>{mo(L('Chưa có tài khoản? Đăng ký ở https://cuongthai.com/register', 'No account? Sign up at https://cuongthai.com/register'))}</Text></Box>
    </Box>
  );
}
