/** Các trang của bộ trang chủ app — mỗi hàm nhận `AppSite`, dựng ở máy chủ. */
import Link from 'next/link';
import { Check, Mail, Minus } from 'lucide-react';
import type { AppSite } from './types';
import { layThongTinStore } from './store';
import { AnhMay, KhoiTai, NutXem, TieuDeMuc } from './ui';
import { DaiAnh, LinhVat } from './client';
import PixelDeco from './PixelDeco';
import s from './appsite.module.css';

const ngayVN = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/* ───────────────────────── Trang chủ ───────────────────────── */
export async function TrangChuApp({ site }: { site: AppSite }) {
  const st = await layThongTinStore(site.appStoreId);
  const noiBat = site.tinhNang.slice(0, 6);
  return (
    <>
      <section className={s.hero}>
        <PixelDeco hinh="sao" o={4} className={s.saoPhai} mau="var(--a2)" />
        <PixelDeco hinh="tim" o={3} className={s.timDuoi} mau="#ff8fab" />
        <div className={s.heroChu}>
          <span className={s.nhanMuc}>
            {st.coTren ? 'Đã có trên App Store' : 'Sắp ra mắt'}
          </span>
          <h1>{site.tieuDeLon}</h1>
          <p className={s.heroMoTa}>{site.moTa}</p>
          <KhoiTai site={site} st={st} lon />
        </div>
        <div className={s.heroAnh}>
          {(site.nhanDan ?? []).slice(0, 4).map((n) => (
            <span key={n} className={`${s.nhanDan} ${[...n].length > 3 ? s.nhanDanDai : ''}`} aria-hidden>{n}</span>
          ))}
          {site.anhChay[0] && <AnhMay anh={site.anhChay[0].anh} nhan={site.anhChay[0].nhan} />}
          {site.gau && (
            <span className={s.gauHero}>
              <LinhVat cam="cheer" size={150} nhan={`Gấu chào mừng bạn tới ${site.ten}`} />
              <span className={s.bongNoi}>{site.loiChao ?? `Chào bạn! Tải ${site.ten} nhé ✨`}</span>
            </span>
          )}
        </div>
      </section>

      {site.conSo.length > 0 && (
        <ul className={s.conSo} aria-label="Con số">
          {site.conSo.map((c) => (
            <li key={c.nhan} className={s.oPixel}>
              <strong>{c.so}</strong>
              <span>{c.nhan}</span>
            </li>
          ))}
        </ul>
      )}

      <section className={s.muc}>
        <TieuDeMuc nhan="Vì sao chọn" tieuDe={`${site.ten} có gì khác`} giua />
        <div className={s.luoi4}>
          {site.diemNoi.map((d) => (
            <div key={d.ten} className={`${s.the} ${s.oPixel}`}>
              <span className={s.emojiTo} aria-hidden>{d.emoji}</span>
              <h3>{d.ten}</h3>
              <p>{d.moTa}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.muc}>
        <TieuDeMuc nhan="Xem trước" tieuDe="Bên trong app" moTa="Ảnh chụp thật từ bản đang có trên App Store." giua />
        <DaiAnh anh={site.anhChay} />
        {site.anhIpad && site.anhIpad.length > 0 && (
          <>
            <h3 className={s.tieuDePhu}>Trên iPad</h3>
            <DaiAnh anh={site.anhIpad} ipad />
          </>
        )}
      </section>

      <section className={s.muc}>
        <TieuDeMuc nhan="Tính năng" tieuDe="Mọi thứ trong một app" giua />
        <div className={s.luoi3}>
          {noiBat.map((t) => (
            <Link key={t.id} href={`${site.goc}/tinh-nang#${t.id}`} className={`${s.the} ${s.theLink} ${s.oPixel}`}>
              <span className={s.emojiTo} aria-hidden>{t.emoji}</span>
              <h3>
                {t.ten} {t.nhan && <em className={s.nhanNho}>{t.nhan}</em>}
              </h3>
              <p>{t.ngan}</p>
            </Link>
          ))}
        </div>
        <div className={s.giua}>
          <NutXem href={`${site.goc}/tinh-nang`}>Xem đủ {site.tinhNang.length} tính năng</NutXem>
        </div>
      </section>

      <section className={s.muc}>
        <TieuDeMuc nhan="Bắt đầu" tieuDe="Ba bước để bắt đầu" giua />
        <ol className={s.baBuoc}>
          {(site.huongDan[0]?.buoc ?? []).slice(0, 3).map((b, i) => (
            <li key={b.ten} className={`${s.the} ${s.oPixel}`}>
              <span className={s.soBuoc}>{i + 1}</span>
              <h3>{b.ten}</h3>
              <p>{b.moTa}</p>
            </li>
          ))}
        </ol>
        <div className={s.giua}>
          <NutXem href={`${site.goc}/huong-dan`}>Xem hướng dẫn chi tiết</NutXem>
        </div>
      </section>

      {site.pro && (
        <section className={`${s.muc} ${s.khoiPro} ${s.oPixel}`}>
          <div>
            <span className={s.nhanMuc}>{site.pro.ten}</span>
            <h2>{site.pro.moTa}</h2>
            <p>{site.pro.gia}</p>
            <NutXem href={`${site.goc}/pro`}>So sánh miễn phí và {site.pro.ten}</NutXem>
          </div>
          {site.gau && <LinhVat cam="love" size={120} />}
        </section>
      )}

      <section className={s.muc}>
        <div className={s.haiCot}>
          <div>
            <TieuDeMuc nhan="Cộng đồng" tieuDe="Học cùng mọi người" moTa={site.congDong.moTa} />
            <div className={s.dsLienKet}>
              {site.congDong.lienKet.slice(0, 4).map((l) => (
                <Link key={l.href} href={l.href} className={`${s.lienKetThe} ${s.oPixel}`}>
                  <b>{l.nhan}</b>
                  {l.moTa && <small>{l.moTa}</small>}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <TieuDeMuc nhan="Hỏi nhanh" tieuDe="Câu hỏi thường gặp" />
            <HoiDapDs ds={site.hoiDap.slice(0, 5)} />
            <NutXem href={`${site.goc}/tro-giup`}>Xem tất cả câu hỏi</NutXem>
          </div>
        </div>
      </section>

      <section className={`${s.muc} ${s.cuoi} ${s.oPixel}`}>
        {site.gau && <LinhVat cam="celebrate" size={110} />}
        <div>
          <h2>Sẵn sàng chưa?</h2>
          <p>Tải {site.ten} miễn phí và bắt đầu ngay hôm nay.</p>
          <KhoiTai site={site} st={st} />
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── Tính năng ───────────────────────── */
export function TinhNangApp({ site }: { site: AppSite }) {
  return (
    <>
      <TieuDeMuc nhan="Tính năng" tieuDe={`Tất cả tính năng của ${site.ten}`} moTa="Bấm một mục ở mục lục để tới thẳng phần đó." />
      <nav className={s.mucLuc} aria-label="Mục lục tính năng">
        {site.tinhNang.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={s.chip}>
            {t.emoji} {t.ten}
          </a>
        ))}
      </nav>
      <div className={s.dsTinhNang}>
        {site.tinhNang.map((t, i) => (
          <section key={t.id} id={t.id} className={`${s.tinhNang} ${i % 2 ? s.dao : ''}`}>
            <div className={s.tinhNangChu}>
              <span className={s.emojiTo} aria-hidden>{t.emoji}</span>
              <h2>
                {t.ten} {t.nhan && <em className={s.nhanNho}>{t.nhan}</em>}
              </h2>
              <p className={s.ngan}>{t.ngan}</p>
              <ul className={s.dsCheck}>
                {t.chiTiet.map((c) => (
                  <li key={c}><Check size={15} aria-hidden /> {c}</li>
                ))}
              </ul>
            </div>
            <div className={s.tinhNangAnh}>
              {t.anh && <AnhMay anh={t.anh} nhan={t.ten} />}
              {t.anhIpad && <AnhMay anh={t.anhIpad} nhan={`${t.ten} trên iPad`} ipad />}
              {!t.anh && !t.anhIpad && <PixelDeco hinh="sao" o={10} mau="var(--a)" mau2="var(--a2)" />}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

/* ───────────────────────── Hướng dẫn ───────────────────────── */
export function HuongDanApp({ site }: { site: AppSite }) {
  return (
    <>
      <TieuDeMuc nhan="Hướng dẫn" tieuDe={`Dùng ${site.ten} từ A tới Z`} moTa="Từng bước ngắn, làm theo thứ tự là dùng được." />
      <nav className={s.mucLuc} aria-label="Mục lục hướng dẫn">
        {site.huongDan.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={s.chip}>
            {n.emoji} {n.tieuDe}
          </a>
        ))}
      </nav>
      {site.huongDan.map((n) => (
        <section key={n.id} id={n.id} className={s.nhomHd}>
          <h2>
            <span aria-hidden>{n.emoji}</span> {n.tieuDe}
          </h2>
          {n.moTa && <p className={s.ngan}>{n.moTa}</p>}
          <ol className={s.dsBuoc}>
            {n.buoc.map((b, i) => (
              <li key={b.ten} className={`${s.buoc} ${s.oPixel}`}>
                <span className={s.soBuoc}>{i + 1}</span>
                <div>
                  <h3>{b.ten}</h3>
                  <p>{b.moTa}</p>
                  {b.meo && <p className={s.meo}>💡 {b.meo}</p>}
                </div>
                {b.anh && <AnhMay anh={b.anh} nhan={b.ten} />}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

/* ───────────────────────── Pro ───────────────────────── */
export async function ProApp({ site }: { site: AppSite }) {
  const st = await layThongTinStore(site.appStoreId);
  const p = site.pro;
  if (!p) return null;
  const o = (v: string) =>
    v === '✓' ? <Check size={16} aria-label="Có" className={s.co} /> : v === '—' ? <Minus size={16} aria-label="Không" className={s.khong} /> : v;
  return (
    <>
      <div className={s.haiCot}>
        <TieuDeMuc nhan={p.ten} tieuDe={p.moTa} moTa={p.gia} />
        {site.gau && <LinhVat cam="love" size={140} />}
      </div>
      <div className={s.bangKhung}>
        <table className={s.bang}>
          <thead>
            <tr>
              <th>Tính năng</th>
              <th>Miễn phí</th>
              <th>{p.ten}</th>
            </tr>
          </thead>
          <tbody>
            {p.bang.map((d) => (
              <tr key={d.muc}>
                <td>{d.muc}</td>
                <td>{o(d.free)}</td>
                <td className={s.cotPro}>{o(d.pro)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.ghiChu}>{p.ghiChu}</p>
      <KhoiTai site={site} st={st} />
    </>
  );
}

/* ───────────────────────── Cộng đồng ───────────────────────── */
export function CongDongApp({ site }: { site: AppSite }) {
  return (
    <>
      <div className={s.haiCot}>
        <TieuDeMuc nhan="Cộng đồng" tieuDe="Hỏi đáp, chia sẻ, học cùng nhau" moTa={site.congDong.moTa} />
        {site.gau && <LinhVat cam="encourage" size={140} />}
      </div>
      <div className={s.luoi3}>
        {site.congDong.lienKet.map((l) =>
          l.ngoai ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`${s.lienKetThe} ${s.oPixel}`}>
              <b>{l.nhan}</b>
              {l.moTa && <small>{l.moTa}</small>}
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={`${s.lienKetThe} ${s.oPixel}`}>
              <b>{l.nhan}</b>
              {l.moTa && <small>{l.moTa}</small>}
            </Link>
          ),
        )}
      </div>
      <section className={s.muc}>
        <TieuDeMuc nhan="Quy tắc" tieuDe="Quy tắc cộng đồng" />
        <ul className={`${s.dsCheck} ${s.the} ${s.oPixel}`}>
          {site.congDong.quyTac.map((q) => (
            <li key={q}><Check size={15} aria-hidden /> {q}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* ───────────────────────── Cập nhật ───────────────────────── */
export async function CapNhatApp({ site }: { site: AppSite }) {
  const st = await layThongTinStore(site.appStoreId);
  return (
    <>
      <TieuDeMuc nhan="Cập nhật" tieuDe="Có gì mới" moTa="Nhật ký các bản phát hành, mới nhất ở trên." />
      {st.coTren && st.phienBan && st.ghiChuBan && !site.capNhat.some((b) => b.phienBan === st.phienBan) && (
        <article className={`${s.banCn} ${s.oPixel}`}>
          <header>
            <b>Phiên bản {st.phienBan}</b>
            {st.ngayBan && <time>{ngayVN(st.ngayBan)}</time>}
          </header>
          <p className={s.ghiChuStore}>{st.ghiChuBan}</p>
        </article>
      )}
      <div className={s.dongThoiGian}>
        {site.capNhat.map((b) => (
          <article key={b.phienBan} className={`${s.banCn} ${s.oPixel}`}>
            <header>
              <b>Phiên bản {b.phienBan}</b>
              <time>{b.ngay}</time>
            </header>
            {b.tieuDe && <h3>{b.tieuDe}</h3>}
            <ul className={s.dsCheck}>
              {b.muc.map((m) => (
                <li key={m}><Check size={15} aria-hidden /> {m}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}

/* ───────────────────────── Trợ giúp ───────────────────────── */
function HoiDapDs({ ds }: { ds: AppSite['hoiDap'] }) {
  return (
    <div className={s.hoiDap}>
      {ds.map((c) => (
        <details key={c.hoi} className={s.cauHoi}>
          <summary>{c.hoi}</summary>
          <p>{c.dap}</p>
        </details>
      ))}
    </div>
  );
}

export function TroGiupApp({ site }: { site: AppSite }) {
  const nhom = [...new Set(site.hoiDap.map((c) => c.nhom ?? 'Chung'))];
  return (
    <>
      <div className={s.haiCot}>
        <TieuDeMuc nhan="Trợ giúp" tieuDe="Câu hỏi thường gặp" moTa="Không thấy câu trả lời? Viết cho chúng mình ở cuối trang." />
        {site.gau && <LinhVat cam="think" size={130} />}
      </div>
      {nhom.map((n) => (
        <section key={n} className={s.muc}>
          <h2 className={s.tieuDePhu}>{n}</h2>
          <HoiDapDs ds={site.hoiDap.filter((c) => (c.nhom ?? 'Chung') === n)} />
        </section>
      ))}
      <section className={`${s.muc} ${s.the} ${s.oPixel}`} id="lien-he">
        <h2>
          <Mail size={18} aria-hidden /> Liên hệ
        </h2>
        <p>
          Email: <a href={`mailto:${site.lienHe.email}`}>{site.lienHe.email}</a> — chúng mình trả lời trong 1–2 ngày làm việc.
        </p>
        <div className={s.dsLienKet}>
          {site.lienHe.kenh.map((k) =>
            k.ngoai ? (
              <a key={k.href} href={k.href} target="_blank" rel="noopener noreferrer" className={s.chip}>{k.nhan}</a>
            ) : (
              <Link key={k.href} href={k.href} className={s.chip}>{k.nhan}</Link>
            ),
          )}
          {site.chinhSach.map((c) => (
            <Link key={c.href} href={c.href} className={s.chip}>{c.nhan}</Link>
          ))}
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── Giới thiệu ───────────────────────── */
export async function GioiThieuApp({ site }: { site: AppSite }) {
  const st = await layThongTinStore(site.appStoreId);
  return (
    <>
      <div className={s.haiCot}>
        <TieuDeMuc nhan="Giới thiệu" tieuDe={`Về ${site.ten}`} />
        {site.gau && <LinhVat cam="happy" size={140} />}
      </div>
      <div className={`${s.the} ${s.oPixel} ${s.vanBan}`}>
        {site.gioiThieu.doan.map((d) => (
          <p key={d}>{d}</p>
        ))}
        <p className={s.ngan}>{site.gioiThieu.nguoiLam}</p>
      </div>
      <section className={s.muc}>
        <TieuDeMuc nhan="Giá trị" tieuDe="Điều chúng mình giữ" giua />
        <div className={s.luoi3}>
          {site.gioiThieu.giaTri.map((g) => (
            <div key={g.ten} className={`${s.the} ${s.oPixel}`}>
              <span className={s.emojiTo} aria-hidden>{g.emoji}</span>
              <h3>{g.ten}</h3>
              <p>{g.moTa}</p>
            </div>
          ))}
        </div>
      </section>
      <KhoiTai site={site} st={st} lon />
    </>
  );
}
