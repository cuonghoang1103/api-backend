// Bài 9.4 — Mã hoá theo trường phía client (CSFLE, mã hoá TƯỜNG MINH — chạy được với MongoDB Community).
// Máy chủ chỉ nhận/lưu bản mã: DBA, bản sao lưu, kẻ trộm ổ đĩa đều không đọc được số điện thoại / số CCCD.
// Khoá chính (CMK) ở đây là khoá "local" 96 byte để chạy lab; production đặt CMK trong KMS (AWS KMS, Azure Key Vault, GCP KMS, KMIP).
import { MongoClient, ClientEncryption } from 'mongodb';
import { randomBytes } from 'node:crypto';

const URI = 'mongodb://127.0.0.1:47017/?directConnection=true';
const kms = { local: { key: randomBytes(96) } };          // ✘ production: KHÔNG sinh/giữ khoá trong mã — lấy từ KMS
const khoKhoa = 'ch9_kms.__keyVault';

const thuong = new MongoClient(URI);
await thuong.connect();
await thuong.db('ch9_kms').dropDatabase();
await thuong.db('ch9_pii').dropDatabase();

const ce = new ClientEncryption(thuong, { keyVaultNamespace: khoKhoa, kmsProviders: kms });
const dek = await ce.createDataKey('local', { keyAltNames: ['khach-pii'] });   // khoá dữ liệu (DEK), lưu đã mã hoá bằng CMK trong __keyVault

const XD = 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic';   // cùng đầu vào ⇒ cùng bản mã ⇒ tìm bằng nhau được
const NN = 'AEAD_AES_256_CBC_HMAC_SHA_512-Random';          // mỗi lần một bản mã khác ⇒ an toàn hơn, nhưng không tìm được
const kh = thuong.db('ch9_pii').collection('khach');
await kh.insertOne({
  _id: 1, ten: 'An',
  sdt: await ce.encrypt('0901000001', { keyId: dek, algorithm: XD }),
  cccd: await ce.encrypt('046203001234', { keyId: dek, algorithm: NN }),
});
await kh.insertOne({ _id: 2, ten: 'Bình', sdt: await ce.encrypt('0901000002', { keyId: dek, algorithm: XD }),
  cccd: await ce.encrypt('046203005678', { keyId: dek, algorithm: NN }) });

console.log('1) Client thường (DBA, bản sao lưu) thấy gì:');
const tho = await kh.findOne({ _id: 1 });
console.log({ ten: tho.ten, sdt: `Binary subtype ${tho.sdt.sub_type}, ${tho.sdt.buffer.length} byte`, cccd: `Binary subtype ${tho.cccd.sub_type}, ${tho.cccd.buffer.length} byte` });
console.log('   tìm { sdt: "0901000001" } bằng chữ thường =>', await kh.countDocuments({ sdt: '0901000001' }));

console.log('2) Client có khoá: tìm bằng bản mã xác định, tự giải mã khi đọc');
const coKhoa = new MongoClient(URI, { autoEncryption: { keyVaultNamespace: khoKhoa, kmsProviders: kms, bypassAutoEncryption: true } });
await coKhoa.connect();
const tim = await ce.encrypt('0901000002', { keyId: dek, algorithm: XD });
console.log('  ', await coKhoa.db('ch9_pii').collection('khach').findOne({ sdt: tim }));

console.log('3) Cùng giá trị mã hai lần:');
const a1 = await ce.encrypt('046203001234', { keyId: dek, algorithm: XD }), a2 = await ce.encrypt('046203001234', { keyId: dek, algorithm: XD });
const b1 = await ce.encrypt('046203001234', { keyId: dek, algorithm: NN }), b2 = await ce.encrypt('046203001234', { keyId: dek, algorithm: NN });
console.log('   Deterministic giống nhau:', a1.buffer.equals(a2.buffer), '· Random giống nhau:', b1.buffer.equals(b2.buffer));

console.log('4) Mất khoá chính (CMK) = mất dữ liệu:');
const khoaKhac = new MongoClient(URI, { autoEncryption: { keyVaultNamespace: khoKhoa, kmsProviders: { local: { key: randomBytes(96) } }, bypassAutoEncryption: true } });
await khoaKhac.connect();
await khoaKhac.db('ch9_pii').collection('khach').findOne({ _id: 1 }).then(() => console.log('   đọc được?!'), (e) => console.log('  ', e.name + ':', e.message.split('\n')[0]));

await ce.deleteKey(dek);   // "crypto-shredding": xoá DEK ⇒ mọi bản mã của nó vĩnh viễn không đọc được
const coKhoa2 = new MongoClient(URI, { autoEncryption: { keyVaultNamespace: khoKhoa, kmsProviders: kms, bypassAutoEncryption: true } });
await coKhoa2.connect();
await coKhoa2.db('ch9_pii').collection('khach').findOne({ _id: 1 }).then((d) => console.log('5) Sau khi xoá DEK:', d), (e) => console.log('5) Sau khi xoá DEK:', e.name + ':', e.message.split('\n')[0]));
await Promise.all([thuong.close(), coKhoa.close(), khoaKhac.close(), coKhoa2.close()]);
