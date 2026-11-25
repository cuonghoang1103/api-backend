/**
 * 8.5 — Lab: một API, hai nền tảng (Express + Spring Boot) (soạn 24/11/2026, agent mgo). SINH bởi scratchpad/mgo/tmp/dung-lab8.py từ tmp/lab8-khung.mjs.
 * Output thật: ../_ma.mjs OUT['s08-5-lab'] (kịch bản demo/s08/s08-5-lab.txt): 0 ngây thơ 3/14 · 1 Express 14/14 · 2 Spring không thử lại 13/14 · 3 Spring 14/14 + số lần thử lại.
 * Mã chép NGUYÊN từ _demo/node/lab8-thu.mjs, lab8-ngay-tho.mjs, lab8-express.mjs, _demo/spring/src/main/java/com/cuongthai/lab8/Lab8App.java.
 */
import { lenh, ma, loiGiai } from '../_chung.mjs';

const K = 's08-5-lab';
const THU_MA = `// Lab 8.5 — MỘT bộ kiểm cho HAI bản API (Express + Mongoose, Spring Boot). Bộ kiểm tự nạp lại dữ liệu lab8 bằng driver rồi gọi HTTP.
// Chạy: node lab8-thu.mjs http://127.0.0.1:47081      (bản Express)     node lab8-thu.mjs http://127.0.0.1:47082   (bản Spring)
import { MongoClient, Decimal128 } from 'mongodb';

const BASE = process.argv[2] ?? 'http://127.0.0.1:47081';
const client = new MongoClient('mongodb://127.0.0.1:47017/lab8?directConnection=true');
const db = client.db();
await db.dropDatabase();
await db.collection('sp').insertMany([
  { _id: 'SP001', ten: 'Áo thun', gia: Decimal128.fromString('33333.33'), ton: 10 },
  { _id: 'SP002', ten: 'Tất', gia: Decimal128.fromString('0.10'), ton: 1000 },
  { _id: 'SP003', ten: 'Mũ', gia: Decimal128.fromString('0.20'), ton: 1000 },
]);
await db.collection('khach').insertOne({ _id: 'KH1', ten: 'An', sdt: '0901', v: 0 });
await db.createCollection('don');

const goi = async (method, path, body) => {
  const r = await fetch(BASE + path, { method, headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch {}
  return { s: r.status, j };
};
let dat = 0, tong = 0;
const kiem = (ten, dung, chiTiet = '') => { tong++; if (dung) dat++; console.log(\`\${dung ? '✔' : '✘'} \${ten}\${dung ? '' : '  ← ' + chiTiet}\`); };

let r = await goi('GET', '/sp/SP001');
kiem('GET /sp/SP001 ⇒ 200, giá là CHUỖI "33333.33"', r.s === 200 && r.j?.gia === '33333.33', JSON.stringify(r));
r = await goi('GET', '/sp/SP999');
kiem('GET /sp/SP999 ⇒ 404', r.s === 404, r.s);
r = await goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP002', sl: 1 }, { sp: 'SP003', sl: 1 }] });
kiem('POST /don 0.10 + 0.20 ⇒ 201, tong đúng "0.30" (không phải 0.30000000000000004)', r.s === 201 && r.j?.tong === '0.30', JSON.stringify(r));
const idDon = r.j?.id;
r = await goi('GET', \`/don/\${idDon}\`);
kiem('GET /don/:id vừa tạo ⇒ 200, có 2 dòng hàng', r.s === 200 && r.j?.items?.length === 2, JSON.stringify(r));
r = await goi('GET', '/don/abc');
kiem('GET /don/abc ⇒ 400 (id không hợp lệ, không phải 500)', r.s === 400, r.s);
r = await goi('GET', '/don/6b04fe3c9cb91bd7dced2467');
kiem('GET /don/<ObjectId không tồn tại> ⇒ 404', r.s === 404, r.s);
for (const [ten, body] of [['items rỗng', { khach: 'KH1', items: [] }], ['sl = 0', { khach: 'KH1', items: [{ sp: 'SP002', sl: 0 }] }],
  ['sl là chuỗi "2"', { khach: 'KH1', items: [{ sp: 'SP002', sl: '2' }] }], ['sl là toán tử {"$gt":0}', { khach: 'KH1', items: [{ sp: 'SP002', sl: { $gt: 0 } }] }]]) {
  r = await goi('POST', '/don', body);
  kiem(\`POST /don \${ten} ⇒ 400\`, r.s === 400, \`\${r.s} \${JSON.stringify(r.j)}\`);
}
r = await goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP002', sl: 5 }, { sp: 'SP001', sl: 11 }] });
const tonSP002 = (await db.collection('sp').findOne({ _id: 'SP002' })).ton;
kiem('POST /don thiếu hàng SP001 ⇒ 409 và KHÔNG trừ SP002 (transaction hủy cả đơn)', r.s === 409 && tonSP002 === 999, \`\${r.s} ton SP002 = \${tonSP002}\`);
r = await goi('PATCH', '/khach/KH1', { sdt: '0911', v: 0 });
const r2 = await goi('PATCH', '/khach/KH1', { sdt: '0922', v: 0 });
kiem('PATCH /khach/KH1 hai lần cùng v=0 ⇒ 200 rồi 409', r.s === 200 && r2.s === 409, \`\${r.s} \${r2.s}\`);

// 40 khách cùng mua 1 SP001 (tồn 10) một lúc
const kq = await Promise.all(Array.from({ length: 40 }, () => goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP001', sl: 1 }] })));
const n201 = kq.filter((x) => x.s === 201).length, n409 = kq.filter((x) => x.s === 409).length;
const ton = (await db.collection('sp').findOne({ _id: 'SP001' })).ton;
const soDon = await db.collection('don').countDocuments({ 'items.sp': 'SP001' });
kiem(\`40 đơn đồng thời trên tồn 10 ⇒ đúng 10×201, 30×409, tồn 0, 10 đơn (đo: \${n201}/\${n409}/\${ton}/\${soDon})\`, n201 === 10 && n409 === 30 && ton === 0 && soDon === 10, kq.filter((x) => ![201, 409].includes(x.s)).map((x) => x.s).join(','));
const d3 = await db.collection('don').findOne({ 'items.sp': 'SP001' });
kiem('tong lưu trong MongoDB là Decimal128 (không phải chuỗi/double)', d3?.tong?._bsontype === 'Decimal128', \`\${typeof d3?.tong} \${d3?.tong?._bsontype}\`);
console.log(\`ĐIỂM: \${dat}/\${tong}\`);
await client.close();`;
const NGAY_MA = `// Lab 8.5 — bản NGÂY THƠ (đừng làm theo): tiền bằng Number, không transaction, không kiểm kiểu, findById thẳng chuỗi lạ.
import express from 'express';
import mongoose from 'mongoose';

const SP = mongoose.model('SP', new mongoose.Schema({ _id: String, ten: String, gia: Number, ton: Number }), 'sp');
const Khach = mongoose.model('Khach', new mongoose.Schema({ _id: String, ten: String, sdt: String, v: Number }), 'khach');
const Don = mongoose.model('Don', new mongoose.Schema({ khach: String, items: Array, tong: Number }), 'don');
const app = express();
app.use(express.json());
app.get('/sp/:ma', async (req, res) => {
  const s = await SP.findById(req.params.ma);
  s ? res.json({ ma: s._id, ten: s.ten, gia: s.gia, ton: s.ton }) : res.status(404).end();
});
app.post('/don', async (req, res) => {
  let tong = 0;
  for (const i of req.body.items) {
    const s = await SP.findById(i.sp);
    if (s.ton < i.sl) return res.status(409).json({ loi: 'het-hang' });   // đọc rồi mới trừ ⇒ tranh chấp
    s.ton -= i.sl; await s.save();
    tong += s.gia * i.sl;
  }
  const d = await Don.create({ khach: req.body.khach, items: req.body.items, tong });
  res.status(201).json({ id: d._id, tong: String(tong) });
});
app.get('/don/:id', async (req, res) => {
  const d = await Don.findById(req.params.id);
  d ? res.json(d) : res.status(404).end();
});
app.patch('/khach/:id', async (req, res) => {
  await Khach.updateOne({ _id: req.params.id }, { sdt: req.body.sdt });
  res.json({ ok: true });
});
await mongoose.connect('mongodb://127.0.0.1:47017/lab8?directConnection=true');
app.listen(47081, '127.0.0.1', () => console.log('lab8 ngây thơ nghe 127.0.0.1:47081'));`;
const EXPRESS_MA = `// Lab 8.5 — LỜI GIẢI bản Express 5 + Mongoose 9. Chạy: node lab8-express.mjs   (cổng 47081, database lab8)
import express from 'express';
import mongoose from 'mongoose';

mongoose.set('transactionAsyncLocalStorage', true);          // mọi lệnh trong connection.transaction() tự mang session
mongoose.set('strictQuery', 'throw');
const { Decimal128 } = mongoose.Types;
const SP = mongoose.model('SP', new mongoose.Schema({ _id: String, ten: String, gia: Decimal128, ton: Number }), 'sp');
const Khach = mongoose.model('Khach', new mongoose.Schema({ _id: String, ten: String, sdt: String, v: Number }), 'khach');
const Don = mongoose.model('Don', new mongoose.Schema({
  khach: String, items: [{ _id: false, sp: String, sl: Number, gia: Decimal128 }], tong: Decimal128, taoLuc: Date,
}), 'don');

class LoiHttp extends Error { constructor(status, body) { super(body.loi); this.status = status; this.body = body; } }
const nguyenDuong = (x) => Number.isInteger(x) && x > 0 && x <= 1000;           // typeof === 'number' ⇒ chặn cả "2" lẫn {"$gt":0}

// Cộng tiền bằng số nguyên "xu" (2 chữ số thập phân) — không bao giờ dùng double cho tiền
const xu = (d) => { const [a, b = ''] = d.toString().split('.'); return BigInt(a + (b + '00').slice(0, 2)); };
const raTien = (n) => { const s = n.toString().padStart(3, '0'); return \`\${s.slice(0, -2)}.\${s.slice(-2)}\`; };

const app = express();
app.use(express.json({ limit: '20kb' }));
app.get('/sp/:ma', async (req, res) => {
  const s = await SP.findById(String(req.params.ma)).lean();
  if (!s) throw new LoiHttp(404, { loi: 'khong-co' });
  res.json({ ma: s._id, ten: s.ten, gia: s.gia.toString(), ton: s.ton });
});
app.post('/don', async (req, res) => {
  const { khach, items } = req.body ?? {};
  if (typeof khach !== 'string' || !Array.isArray(items) || items.length === 0 || items.length > 20
      || !items.every((i) => typeof i?.sp === 'string' && nguyenDuong(i.sl))) throw new LoiHttp(400, { loi: 'du-lieu-sai' });
  const don = await mongoose.connection.transaction(async () => {
    const dong = []; let tong = 0n;
    for (const { sp, sl } of items) {
      const s = await SP.findOneAndUpdate({ _id: sp, ton: { $gte: sl } }, { $inc: { ton: -sl } }, { returnDocument: 'after', projection: { gia: 1 } }).lean();
      if (!s) throw new LoiHttp(409, { loi: 'het-hang', sp });       // ném ⇒ transaction hủy ⇒ các dòng trước được hoàn kho
      dong.push({ sp, sl, gia: s.gia }); tong += xu(s.gia) * BigInt(sl);
    }
    const [d] = await Don.create([{ khach, items: dong, tong: Decimal128.fromString(raTien(tong)), taoLuc: new Date() }]);
    return d;
  });
  res.status(201).json({ id: don._id, tong: don.tong.toString() });
});
app.get('/don/:id', async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) throw new LoiHttp(400, { loi: 'id-sai' });
  const d = await Don.findById(req.params.id).lean();
  if (!d) throw new LoiHttp(404, { loi: 'khong-co' });
  res.json({ id: d._id, khach: d.khach, tong: d.tong.toString(), items: d.items.map((i) => ({ ...i, gia: i.gia.toString() })) });
});
app.patch('/khach/:id', async (req, res) => {
  const { sdt, v } = req.body ?? {};
  if (typeof sdt !== 'string' || !Number.isInteger(v)) throw new LoiHttp(400, { loi: 'du-lieu-sai' });
  const r = await Khach.updateOne({ _id: String(req.params.id), v }, { $set: { sdt }, $inc: { v: 1 } });
  if (r.matchedCount === 0) throw new LoiHttp(409, { loi: 'da-bi-sua' });
  res.json({ v: v + 1 });
});
app.use((err, req, res, next) => {                              // Express 5: lỗi trong hàm async tự tới đây
  if (err instanceof LoiHttp) return res.status(err.status).json(err.body);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ loi: 'json-sai' });
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });
});

await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/lab8?directConnection=true', { maxPoolSize: 20 });
const server = app.listen(47081, '127.0.0.1', () => console.log('lab8 Express nghe 127.0.0.1:47081'));
process.on('SIGTERM', () => server.close(() => mongoose.disconnect().then(() => process.exit(0))));`;
const SPRING_MA = `package com.cuongthai.lab8;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.mongodb.MongoException;
import org.bson.types.ObjectId;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.*;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/**
 * Lab 8.5 — LỜI GIẢI bản Spring Boot 4.1 + Spring Data MongoDB 5.1 (cùng hợp đồng API với lab8-express.mjs).
 * Chạy: ./chay-lab8.sh   (cổng 47082, database lab8)
 */
@SpringBootApplication
public class Lab8App {
  public static void main(String[] a) { SpringApplication.run(Lab8App.class, a); }

  /** Không có bean này thì @Transactional không bao MongoDB (Bài 8.4). */
  @Bean MongoTransactionManager transactionManager(MongoDatabaseFactory f) { return new MongoTransactionManager(f); }

  @Document("sp") public record SP(@Id String id, String ten, BigDecimal gia, int ton) {}
  @Document("don") public record Don(@Id ObjectId id, String khach, List<Dong> items, BigDecimal tong, Instant taoLuc) {}
  public record Dong(String sp, int sl, BigDecimal gia) {}
  public record DongVao(Object sp, Object sl) {}                          // Object: tự kiểm kiểu, không để Jackson ép "2" thành 2
  public record DonVao(Object khach, List<DongVao> items) {}
  public record KhachVao(Object sdt, Object v) {}

  public static class LoiHttp extends RuntimeException {
    final HttpStatus status; final Map<String, Object> body;
    LoiHttp(HttpStatus s, Map<String, Object> b) { super(String.valueOf(b.get("loi"))); status = s; body = b; }
  }

  @Service public static class DonService {
    private final MongoTemplate mongo;
    DonService(MongoTemplate mongo) { this.mongo = mongo; }

    @Transactional
    public Don datHang(String khach, List<Dong> vao) {
      var dong = new ArrayList<Dong>(); var tong = BigDecimal.ZERO;
      for (var d : vao) {
        var s = mongo.findAndModify(Query.query(Criteria.where("_id").is(d.sp()).and("ton").gte(d.sl())),
            new Update().inc("ton", -d.sl()), FindAndModifyOptions.options().returnNew(true), SP.class);
        if (s == null) throw new LoiHttp(HttpStatus.CONFLICT, Map.of("loi", "het-hang", "sp", d.sp()));
        dong.add(new Dong(d.sp(), d.sl(), s.gia())); tong = tong.add(s.gia().multiply(BigDecimal.valueOf(d.sl())));
      }
      return mongo.insert(new Don(null, khach, dong, tong, Instant.now()));
    }
  }

  @RestController public static class Api {
    private final MongoTemplate mongo; private final DonService don;
    static final AtomicInteger THU_LAI = new AtomicInteger();
    static final boolean KHONG_THU_LAI = Boolean.getBoolean("lab8.khongThuLai");   // -Dlab8.khongThuLai=true để thấy điều gì xảy ra
    Api(MongoTemplate mongo, DonService don) { this.mongo = mongo; this.don = don; }

    static boolean nguyenDuong(Object x) { return x instanceof Integer i && i > 0 && i <= 1000; }

    @GetMapping("/sp/{ma}") Map<String, Object> sp(@PathVariable String ma) {
      var s = mongo.findById(ma, SP.class);
      if (s == null) throw new LoiHttp(HttpStatus.NOT_FOUND, Map.of("loi", "khong-co"));
      return Map.of("ma", s.id(), "ten", s.ten(), "gia", s.gia().toPlainString(), "ton", s.ton());
    }

    @PostMapping("/don") ResponseEntity<Map<String, Object>> datHang(@RequestBody DonVao v) {
      if (!(v.khach() instanceof String k) || v.items() == null || v.items().isEmpty() || v.items().size() > 20
          || !v.items().stream().allMatch(d -> d != null && d.sp() instanceof String && nguyenDuong(d.sl())))
        throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "du-lieu-sai"));
      var dong = v.items().stream().map(d -> new Dong((String) d.sp(), (Integer) d.sl(), null)).toList();
      for (int lan = 1; ; lan++) {                       // @Transactional KHÔNG tự thử lại WriteConflict — phải tự làm
        try {
          var d = don.datHang(k, dong);
          return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", d.id().toHexString(), "tong", d.tong().toPlainString()));
        } catch (DataAccessException e) {
          if (!KHONG_THU_LAI && lan < 20 && e.getMostSpecificCause() instanceof MongoException m && m.hasErrorLabel(MongoException.TRANSIENT_TRANSACTION_ERROR_LABEL)) {
            THU_LAI.incrementAndGet(); continue;
          }
          throw e;
        }
      }
    }

    @GetMapping("/don/{id}") Map<String, Object> xemDon(@PathVariable String id) {
      if (!ObjectId.isValid(id)) throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "id-sai"));
      var d = mongo.findById(new ObjectId(id), Don.class);
      if (d == null) throw new LoiHttp(HttpStatus.NOT_FOUND, Map.of("loi", "khong-co"));
      return Map.of("id", id, "khach", d.khach(), "tong", d.tong().toPlainString(),
          "items", d.items().stream().map(x -> Map.of("sp", x.sp(), "sl", x.sl(), "gia", x.gia().toPlainString())).toList());
    }

    @PatchMapping("/khach/{id}") Map<String, Object> suaKhach(@PathVariable String id, @RequestBody KhachVao v) {
      if (!(v.sdt() instanceof String sdt) || !(v.v() instanceof Integer ver)) throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "du-lieu-sai"));
      var r = mongo.updateFirst(Query.query(Criteria.where("_id").is(id).and("v").is(ver)), new Update().set("sdt", sdt).inc("v", 1), "khach");
      if (r.getMatchedCount() == 0) throw new LoiHttp(HttpStatus.CONFLICT, Map.of("loi", "da-bi-sua"));
      return Map.of("v", ver + 1);
    }

    @GetMapping("/thu-lai") Map<String, Object> thuLai() { return Map.of("thuLai", THU_LAI.get()); }

    @ExceptionHandler(LoiHttp.class) ResponseEntity<Map<String, Object>> loi(LoiHttp e) { return ResponseEntity.status(e.status).body(e.body); }
  }
}`;

const GIAI_EN = `<p>Both solutions apply the same five ideas from this chapter: (1) validate types at the edge — <code>Number.isInteger</code> in JavaScript, <code>instanceof Integer</code> on an <code>Object</code> field in Java — so <code>"2"</code> and <code>{"$gt":0}</code> never reach a filter (Lessons 8.2, 9.3); (2) check and decrement stock in one conditional update per line (Lesson 6.1) inside one transaction, so a later line that fails rolls back the earlier ones (Lessons 8.3, 8.4); (3) money as Decimal128 in the database and strings in JSON, computed in integer cents in Node and <code>BigDecimal</code> in Java (Lessons 1.2, 8.1, 8.4); (4) ObjectId validated before use ⇒ 400 (Lesson 8.1); (5) a version filter for the profile update ⇒ 409 (Lesson 6.1). The difference between the stacks is the retry: Mongoose's <code>connection.transaction()</code> retries <code>TransientTransactionError</code> by itself; Spring's <code>@Transactional</code> does not, so the controller loops.</p>
${ma('js', EXPRESS_MA)}
${ma('java', SPRING_MA)}
${lenh(K, 3)}`;
const GIAI_VI = `<p>Hai lời giải áp cùng năm ý của chương này: (1) kiểm kiểu ở rìa — <code>Number.isInteger</code> trong JavaScript, <code>instanceof Integer</code> trên trường <code>Object</code> trong Java — để <code>"2"</code> và <code>{"$gt":0}</code> không bao giờ tới bộ lọc (Bài 8.2, 9.3); (2) kiểm và trừ kho bằng một lệnh cập nhật có điều kiện cho mỗi dòng hàng (Bài 6.1) trong một transaction, để dòng sau hỏng thì các dòng trước được hoàn tác (Bài 8.3, 8.4); (3) tiền là Decimal128 trong database và chuỗi trong JSON, tính bằng số nguyên xu ở Node và <code>BigDecimal</code> ở Java (Bài 1.2, 8.1, 8.4); (4) kiểm ObjectId trước khi dùng ⇒ 400 (Bài 8.1); (5) bộ lọc version cho lệnh sửa hồ sơ ⇒ 409 (Bài 6.1). Khác biệt giữa hai nền tảng là việc thử lại: <code>connection.transaction()</code> của Mongoose tự thử lại <code>TransientTransactionError</code>; <code>@Transactional</code> của Spring thì không, nên controller phải tự lặp.</p>
${ma('js', EXPRESS_MA)}
${ma('java', SPRING_MA)}
${lenh(K, 3)}`;

const RUBRIC = (en) => `<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Express version: checker prints ĐIỂM: 14/14 three runs in a row (paste outputs)' : 'Bản Express: bộ kiểm in ĐIỂM: 14/14 ba lần liền (dán output)'}</td><td>2</td></tr>
<tr><td>${en ? 'Spring version: checker prints ĐIỂM: 14/14 three runs in a row' : 'Bản Spring: bộ kiểm in ĐIỂM: 14/14 ba lần liền'}</td><td>2</td></tr>
<tr><td>${en ? 'LAB8.md: each of the 11 failures of the naive version mapped to its cause and lesson' : 'LAB8.md: mỗi lỗi trong 11 lỗi của bản ngây thơ gắn với nguyên nhân và bài học'}</td><td>2</td></tr>
<tr><td>${en ? 'Money never passes through a JavaScript number or Java double (show the lines)' : 'Tiền không bao giờ đi qua number của JavaScript hay double của Java (chỉ ra các dòng)'}</td><td>1</td></tr>
<tr><td>${en ? 'Spring retry measured: the result without retry, the retry count with it, and an explanation' : 'Đo việc thử lại ở Spring: kết quả khi không thử lại, số lần thử lại khi có, và giải thích'}</td><td>1</td></tr>
<tr><td>${en ? 'One MongoClient / connection per process, explicit pool size, graceful shutdown in both' : 'Một MongoClient / kết nối mỗi tiến trình, cỡ pool ghi rõ, tắt êm ở cả hai bản'}</td><td>1</td></tr>
<tr><td>${en ? 'Defence: answer two questions below without notes' : 'Bảo vệ: trả lời hai câu dưới đây không nhìn tài liệu'}</td><td>1</td></tr>
</tbody></table>`;

export default {
  title: '8.5 — Lab: one API, two stacks (Express + Spring Boot)|||8.5 — Lab: một API, hai nền tảng (Express + Spring Boot)',
  slug: 'mgo-8-5-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 120 phút: cài đặt cùng một API bán hàng nhỏ (xem sản phẩm, đặt đơn nhiều dòng trong transaction, xem đơn, sửa hồ sơ có version) hai lần — Express 5 + Mongoose 9 và Spring Boot 4 + Spring Data MongoDB 5 — cho tới khi MỘT bộ kiểm HTTP phát sẵn chấm 14/14 cho cả hai: giá là chuỗi Decimal128 chính xác (0,10 + 0,20 = "0.30"), id sai ⇒ 400, kiểu sai và toán tử chèn vào ⇒ 400, thiếu hàng hủy cả đơn, sửa trùng version ⇒ 409, 40 đơn đồng thời trên tồn 10 ⇒ đúng 10 đơn. Bản ngây thơ phát sẵn đạt 3/14 (bán hàng chục đơn trên tồn 10, số đổi theo lượt — chạy thật); bản Spring bỏ thử lại WriteConflict đạt 13/14 với hàng loạt lỗi 500. Rubric 10 điểm, câu bảo vệ, lời giải che (14/14 cả hai, chạy thật).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab</span>
<h2>Lab: one API, two stacks (Express + Spring Boot)</h2>
<p class="lead">In real projects the same backend contract is often implemented twice — a Node service and a Java service, a rewrite, a migration between teams. One black-box test suite that both must pass is how teams keep them honest. You will implement a small shop API twice, with Express 5 + Mongoose 9 and with Spring Boot 4 + Spring Data MongoDB 5, until the provided HTTP checker gives <strong>14/14</strong> to both. Every check corresponds to a bug measured in this chapter.</p>

<h3>Setup</h3>
<p>Lab running (Lesson 0.2). In <code>_demo/node</code> (<code>npm install</code> once): <code>lab8-thu.mjs</code> — the checker, do not change it; it reloads the <code>lab8</code> database itself before each run; <code>lab8-ngay-tho.mjs</code> — a naive Express version. In <code>_demo/spring</code>: the Maven project of Lesson 8.4 (build once as described in <code>chay.sh</code>) and <code>chay-lab8.sh</code>, which starts <code>com.cuongthai.lab8.Lab8App</code> on port 47082. The solutions (<code>lab8-express.mjs</code>, <code>Lab8App.java</code>) are in the repository — do not open them yet; write yours as <code>lab8-cua-ban.mjs</code> and a class in your own package.</p>
<p><strong>The contract</strong> (Express on 127.0.0.1:47081, Spring on 127.0.0.1:47082, database <code>lab8</code>: <code>sp { _id, ten, gia: Decimal128, ton }</code>, <code>khach { _id, ten, sdt, v }</code>, <code>don</code>):</p>
<ul>
<li><code>GET /sp/:ma</code> ⇒ 200 <code>{ ma, ten, gia: "33333.33", ton }</code> (price as a string) or 404.</li>
<li><code>POST /don { khach, items: [{ sp, sl }] }</code> ⇒ 201 <code>{ id, tong: "…" }</code>; 400 if <code>khach</code> is not a string, items empty or more than 20, <code>sl</code> not an integer 1–1000 (a string "2" or an object is a 400); 409 <code>{ loi: 'het-hang', sp }</code> if any line lacks stock — and then <em>no</em> line may be deducted.</li>
<li><code>GET /don/:id</code> ⇒ 200 with items, 400 for an invalid ObjectId, 404 if absent.</li>
<li><code>PATCH /khach/:id { sdt, v }</code> ⇒ 200 <code>{ v: v + 1 }</code>, or 409 if <code>v</code> is not the current version.</li>
</ul>
<p>The naive version, as many first attempts look:</p>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
<p>Three out of fourteen. Prices become JavaScript numbers and 0.10 + 0.20 is billed as 0.30000000000000004; <code>"abc"</code> as an order id is a 500; an empty order, a quantity of 0 and the string "2" are accepted (and "2" × 0.10 became 0.2 by JavaScript coercion); <code>{"$gt": 0}</code> as a quantity crashes the server; a failed second line leaves the first line's stock deducted; two edits with the same version both "succeed"; and 40 simultaneous orders on a stock of 10 produced <strong>23 orders</strong> in this run (26 and 38 in other runs — the number changes, the overselling does not) — read-then-write is a race (Lesson 2.5).</p>
<details><summary>The checker (read it to know exactly what is tested)</summary>
${ma('js', THU_MA)}
</details>

<h3>Tasks</h3>
<ol>
<li><strong>Diagnose</strong> the naive version in <code>LAB8.md</code>: for each of the 11 failed checks, the responsible line and the lesson of this chapter (or earlier) that explains it.</li>
<li><strong>Express</strong>: implement <code>lab8-cua-ban.mjs</code> until <code>node lab8-thu.mjs http://127.0.0.1:47081</code> prints <code>ĐIỂM: 14/14</code>. Run it three times.</li>
<li><strong>Spring</strong>: implement the same contract until <code>node lab8-thu.mjs http://127.0.0.1:47082</code> prints 14/14, three times.</li>
<li><strong>Measure the retry</strong>: in the Spring version, disable your retry of <code>TransientTransactionError</code>. Paste the checker's output and count the 500s in the log. Re-enable it and report how many retries 40 concurrent orders needed. Explain why the Express version did not need explicit code for this.</li>
<li><strong>Compare</strong> in ten lines: where each stack made a rule easy or hard (validation, money, transactions, error mapping).</li>
</ol>
<p><strong>Advanced:</strong> add <code>GET /khach/:id/don?sau=&lt;id&gt;</code> with keyset paging (Lesson 2.6) to both and extend the checker; add an <code>Idempotency-Key</code> header to <code>POST /don</code> so a client retry does not create a second order (Lesson 6.5's unique-index idea).</p>

<h3>Rubric (10 points)</h3>
${RUBRIC(true)}
<h3>Defence questions</h3>
<ul>
<li>Your Spring version passes 14/14. A teammate removes the <code>MongoTransactionManager</code> bean "because the app still starts". Which check fails first, and what does the database contain afterwards?</li>
<li>Why does the checker send <code>"sl": "2"</code>? What would happen in each stack without the type check, and where does the value end up?</li>
<li>Under 40 concurrent orders, would the solution still sell exactly 10 if the stock decrement were <code>findById</code> + compare + <code>save()</code> inside the same transaction? Explain with what you know about WriteConflict.</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your own attempt (both 14/14, run for real)', GIAI_EN)}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab</span>
<h2>Lab: một API, hai nền tảng (Express + Spring Boot)</h2>
<p class="lead">Ở dự án thật, cùng một hợp đồng backend hay được cài đặt hai lần — một dịch vụ Node và một dịch vụ Java, một lần viết lại, một lần chuyển giao giữa các nhóm. Một bộ test hộp đen mà cả hai phải qua là cách các nhóm giữ chúng trung thực. Bạn sẽ cài đặt một API cửa hàng nhỏ hai lần, bằng Express 5 + Mongoose 9 và bằng Spring Boot 4 + Spring Data MongoDB 5, tới khi bộ kiểm HTTP phát sẵn chấm <strong>14/14</strong> cho cả hai. Mỗi phép kiểm ứng với một lỗi đã đo trong chương này.</p>

<h3>Chuẩn bị</h3>
<p>Lab đang chạy (Bài 0.2). Trong <code>_demo/node</code> (<code>npm install</code> một lần): <code>lab8-thu.mjs</code> — bộ kiểm, đừng sửa; nó tự nạp lại database <code>lab8</code> trước mỗi lượt; <code>lab8-ngay-tho.mjs</code> — bản Express ngây thơ. Trong <code>_demo/spring</code>: dự án Maven của Bài 8.4 (dựng một lần như ghi trong <code>chay.sh</code>) và <code>chay-lab8.sh</code>, khởi động <code>com.cuongthai.lab8.Lab8App</code> ở cổng 47082. Lời giải (<code>lab8-express.mjs</code>, <code>Lab8App.java</code>) có sẵn trong kho — đừng mở vội; viết bản của bạn thành <code>lab8-cua-ban.mjs</code> và một lớp trong package riêng.</p>
<p><strong>Hợp đồng</strong> (Express ở 127.0.0.1:47081, Spring ở 127.0.0.1:47082, database <code>lab8</code>: <code>sp { _id, ten, gia: Decimal128, ton }</code>, <code>khach { _id, ten, sdt, v }</code>, <code>don</code>):</p>
<ul>
<li><code>GET /sp/:ma</code> ⇒ 200 <code>{ ma, ten, gia: "33333.33", ton }</code> (giá dạng chuỗi) hoặc 404.</li>
<li><code>POST /don { khach, items: [{ sp, sl }] }</code> ⇒ 201 <code>{ id, tong: "…" }</code>; 400 nếu <code>khach</code> không phải chuỗi, items rỗng hoặc quá 20, <code>sl</code> không phải số nguyên 1–1000 (chuỗi "2" hay object đều là 400); 409 <code>{ loi: 'het-hang', sp }</code> nếu dòng nào thiếu hàng — và khi đó <em>không</em> dòng nào được trừ kho.</li>
<li><code>GET /don/:id</code> ⇒ 200 kèm các dòng hàng, 400 với ObjectId sai, 404 nếu không có.</li>
<li><code>PATCH /khach/:id { sdt, v }</code> ⇒ 200 <code>{ v: v + 1 }</code>, hoặc 409 nếu <code>v</code> không phải version hiện tại.</li>
</ul>
<p>Bản ngây thơ, giống nhiều lần thử đầu tiên:</p>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
<p>Ba trên mười bốn. Giá thành number của JavaScript nên 0,10 + 0,20 bị tính thành 0.30000000000000004; <code>"abc"</code> làm mã đơn ra lỗi 500; đơn rỗng, số lượng 0 và chuỗi "2" đều được nhận (và "2" × 0,10 thành 0.2 nhờ JavaScript tự ép kiểu); <code>{"$gt": 0}</code> làm số lượng khiến máy chủ sập; dòng thứ hai hỏng để lại kho của dòng thứ nhất đã bị trừ; hai lần sửa cùng version đều "thành công"; và 40 đơn cùng lúc trên tồn 10 sinh ra <strong>23 đơn</strong> ở lượt này (26 và 38 ở các lượt khác — con số đổi, việc bán quá thì không) — đọc rồi mới ghi là một cuộc đua (Bài 2.5).</p>
<details><summary>Bộ kiểm (đọc để biết chính xác kiểm gì)</summary>
${ma('js', THU_MA)}
</details>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Chẩn đoán</strong> bản ngây thơ trong <code>LAB8.md</code>: với mỗi phép kiểm trong 11 phép hỏng, chỉ dòng gây lỗi và bài học của chương này (hoặc chương trước) giải thích nó.</li>
<li><strong>Express</strong>: cài đặt <code>lab8-cua-ban.mjs</code> tới khi <code>node lab8-thu.mjs http://127.0.0.1:47081</code> in <code>ĐIỂM: 14/14</code>. Chạy ba lần.</li>
<li><strong>Spring</strong>: cài đặt cùng hợp đồng tới khi <code>node lab8-thu.mjs http://127.0.0.1:47082</code> in 14/14, ba lần.</li>
<li><strong>Đo việc thử lại</strong>: ở bản Spring, tắt phần tự thử lại <code>TransientTransactionError</code> của bạn. Dán output của bộ kiểm và đếm số lỗi 500 trong log. Bật lại và báo 40 đơn đồng thời cần bao nhiêu lần thử lại. Giải thích vì sao bản Express không cần mã riêng cho việc này.</li>
<li><strong>So sánh</strong> trong mười dòng: nền tảng nào làm luật nào dễ hay khó (kiểm hợp lệ, tiền, transaction, ánh xạ lỗi).</li>
</ol>
<p><strong>Nâng cao:</strong> thêm <code>GET /khach/:id/don?sau=&lt;id&gt;</code> với phân trang keyset (Bài 2.6) cho cả hai và mở rộng bộ kiểm; thêm header <code>Idempotency-Key</code> cho <code>POST /don</code> để client gửi lại không sinh đơn thứ hai (ý tưởng index duy nhất của Bài 6.5).</p>

<h3>Rubric (10 điểm)</h3>
${RUBRIC(false)}
<h3>Câu hỏi bảo vệ</h3>
<ul>
<li>Bản Spring của bạn đạt 14/14. Một đồng đội xoá bean <code>MongoTransactionManager</code> "vì ứng dụng vẫn khởi động được". Phép kiểm nào hỏng trước, và sau đó database chứa gì?</li>
<li>Vì sao bộ kiểm gửi <code>"sl": "2"</code>? Ở mỗi nền tảng, thiếu phép kiểm kiểu thì chuyện gì xảy ra, và giá trị đó rơi vào đâu?</li>
<li>Với 40 đơn đồng thời, lời giải có còn bán đúng 10 không nếu bước trừ kho là <code>findById</code> + so sánh + <code>save()</code> trong cùng transaction? Giải thích bằng những gì bạn biết về WriteConflict.</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi tự làm (cả hai 14/14, chạy thật)', GIAI_VI)}
</div>
`,
};
