/**
 * Thử cả chuỗi kế hoạch trên DB cục bộ: tạo → tới giờ → nhắc → xong.
 *
 * ⚠️ DỌN DẸP THEO ID ĐÃ GHI LÚC TẠO, không phải "xoá cái đầu tiên
 * khớp" — bài học cũ của dự án: kiểu sau ăn nhầm dữ liệu thật.
 */
import { prisma } from '../src/config/database.js';
import {
  quetToiHan, chamXong, homNay, tomTat, gioDiaPhuong, ghiVuaNhac, doanViec,
  danhDauDaNhac, hoanLai, danhSachTreo,
} from '../src/services/makerlab/keHoach.js';
import { khopLenhKeHoach, xuLyLenhKeHoach } from '../src/services/makerlab/lenhKeHoach.js';

let sai = 0;
function la(nhan: string, duoc: unknown, mong: unknown) {
  const ok = JSON.stringify(duoc) === JSON.stringify(mong);
  if (!ok) sai++;
  console.log(`${ok ? '✓' : '✗'} ${nhan.padEnd(50)} ${JSON.stringify(duoc)}${ok ? '' : ` ✗ mong ${JSON.stringify(mong)}`}`);
}

const TZ = 'Asia/Ho_Chi_Minh';
const idDaTao: number[] = [];

async function main() {
  const user = await prisma.user.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });
  const proj = await prisma.makerProject.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });
  if (!user || !proj) { console.log('⚠️ DB cục bộ chưa có user/project — bỏ qua'); return; }

  const bayGio = new Date();
  const moc = gioDiaPhuong(bayGio, TZ);
  console.log(`Giờ VN lúc chạy: ${moc.ngay} phút ${moc.phut} (thứ ${moc.thu})\n`);

  // ── Tạo 2 việc: một tới giờ RỒI, một CHƯA tới ──
  const daToi = await prisma.makerPlan.create({
    data: {
      ownerId: user.id, projectId: proj.id, tz: TZ,
      title: 'THU tap the duc', kind: 'DAILY',
      gio: Math.max(0, moc.phut - 2),          // 2 phút trước
      huongDan: 'Chống đẩy 20 cái rồi plank một phút.',
    },
  });
  idDaTao.push(daToi.id);

  const chuaToi = await prisma.makerPlan.create({
    data: {
      ownerId: user.id, projectId: proj.id, tz: TZ,
      title: 'THU hop nhom', kind: 'DAILY',
      gio: Math.min(1439, moc.phut + 120),     // 2 tiếng nữa
    },
  });
  idDaTao.push(chuaToi.id);

  console.log('─── Quét tới hạn ───');
  const q1 = await quetToiHan(bayGio);
  const cua = q1.filter((x) => idDaTao.includes(x.plan.id));
  la('chỉ việc ĐÃ tới giờ được quét ra', cua.map((x) => x.plan.title), ['THU tap the duc']);
  const run = cua[0]?.run;
  la('lượt sinh ra ở đúng ngày địa phương', run?.ngay, moc.ngay);
  la('chưa nói ra thì nhacLuc rỗng', run?.nhacLuc, null);

  console.log('\n─── Robot offline: quét lại vẫn phải ra, KHÔNG bốc hơi ───');
  const q2 = await quetToiHan(bayGio);
  la('nhịp sau vẫn còn việc đó', q2.filter((x) => x.plan.id === daToi.id).length, 1);

  console.log('\n─── Đã nói ra rồi thì thôi, không nhắc chồng ───');
  await danhDauDaNhac(run!.id, bayGio);
  const q3 = await quetToiHan(bayGio);
  la('không nhắc lại nữa', q3.filter((x) => x.plan.id === daToi.id).length, 0);

  console.log('\n─── Danh sách hôm nay ───');
  const hn = (await homNay(user.id, bayGio)).filter((m) => idDaTao.includes(m.planId));
  la('cả hai việc đều trong lịch hôm nay', hn.length, 2);
  la('việc chưa tới giờ mang trạng thái CHUA_TOI', hn.find((m) => m.planId === chuaToi.id)?.state, 'CHUA_TOI');
  la('việc đã nhắc mang trạng thái PENDING', hn.find((m) => m.planId === daToi.id)?.state, 'PENDING');

  console.log('\n─── "xong rồi" trỏ đúng việc robot VỪA nhắc ───');
  const DEV_GIA = 987654;
  ghiVuaNhac(DEV_GIA, run!.id);
  const doan = await doanViec(user.id, DEV_GIA, 'xong rồi nhé');
  la('đoán ra đúng việc', doan?.run.plan.title, 'THU tap the duc');
  la('và biết vì sao đoán được', doan?.vi, 'vua-nhac');

  console.log('\n─── Lệnh giọng nói ───');
  la('khớp "hôm nay có gì"', khopLenhKeHoach('Odin ơi hôm nay có việc gì')?.loai, 'hom-nay');
  la('khớp "xong rồi"', khopLenhKeHoach('xong rồi')?.loai, 'xong');
  la('khớp "hoãn 15 phút" + số phút', khopLenhKeHoach('hoãn 15 phút đi')?.phut, 15);
  la('khớp "lát nữa" → mặc định 10', khopLenhKeHoach('để lát nữa')?.phut, 10);
  la('khớp "bỏ qua"', khopLenhKeHoach('thôi bỏ qua')?.loai, 'bo-qua');
  la('câu kể chuyện dài KHÔNG phải lệnh', khopLenhKeHoach('hôm nay tôi đi làm về mệt quá nên ăn cơm xong rồi đi ngủ luôn chứ chẳng làm được gì cả thật là chán'), null);

  ghiVuaNhac(DEV_GIA, run!.id);
  const ra = await xuLyLenhKeHoach({ loai: 'xong' }, user.id, DEV_GIA, 'xong rồi');
  la('thi hành "xong" có tích xanh', ra?.runId, run!.id);
  console.log(`   robot nói: "${ra?.cau}"`);

  const sauKhiXong = await prisma.makerPlanRun.findUnique({ where: { id: run!.id } });
  la('trạng thái trong DB là DONE', sauKhiXong?.state, 'DONE');
  la('có ghi mốc lúc xong', sauKhiXong?.xongLuc != null, true);

  console.log('\n─── Hoãn thì phải XOÁ nhacLuc, không thì hoãn = tắt luôn ───');
  const run2 = await prisma.makerPlanRun.create({
    data: { planId: chuaToi.id, ngay: moc.ngay, state: 'PENDING', nhacLuc: bayGio },
  });
  await hoanLai(run2.id, 5);
  const sauHoan = await prisma.makerPlanRun.findUnique({ where: { id: run2.id } });
  la('nhacLuc đã bị xoá', sauHoan?.nhacLuc, null);
  la('có mốc hoãn tới', sauHoan?.hoanToi != null, true);

  console.log('\n─── Không có việc treo thì "xong rồi" KHÔNG bị cướp lượt ───');
  await prisma.makerPlanRun.updateMany({
    where: { planId: { in: idDaTao } }, data: { state: 'DONE' },
  });
  const treo = (await danhSachTreo(user.id)).filter((r) => idDaTao.includes(r.planId));
  la('không còn việc nào treo (của bài thử)', treo.length, 0);

  const t = tomTat(await homNay(user.id, bayGio));
  console.log(`\nTóm tắt hôm nay: ${t.tong} việc, xong ${t.xong}, còn ${t.conLai}, lỡ ${t.loQua}`);
}

main()
  .catch((e) => { sai++; console.error('LỖI:', e); })
  .finally(async () => {
    // Xoá theo ID ĐÃ GHI, không phải theo tên hay "cái mới nhất".
    if (idDaTao.length) {
      await prisma.makerPlanRun.deleteMany({ where: { planId: { in: idDaTao } } });
      const d = await prisma.makerPlan.deleteMany({ where: { id: { in: idDaTao } } });
      console.log(`\n🧹 đã dọn ${d.count} kế hoạch thử (id ${idDaTao.join(', ')})`);
    }
    await prisma.$disconnect();
    console.log(sai === 0 ? '\n✅ TẤT CẢ ĐÚNG' : `\n❌ ${sai} ca sai`);
    process.exit(sai === 0 ? 0 : 1);
  });
