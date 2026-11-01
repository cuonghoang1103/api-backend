// grpc/bench.mjs — đo trên CÙNG máy: kích thước 100 lượt đặt (JSON vs Protobuf) và 2.000 lời gọi tuần tự
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import protobuf from 'protobufjs';
import { seedBookings } from '../src/seed.js';

const PROTO = new URL('./labflow.proto', import.meta.url).pathname;
const root = await protobuf.load(PROTO);
const Res = root.lookupType('labflow.v1.ListBookingsResponse');
const STATUS = { PENDING: 1, CHECKED_IN: 2, CANCELLED: 3 };
const rows = seedBookings(100);
const asJson = JSON.stringify({ data: rows.map((b) => ({ id: b.id, labId: b.labId, userId: b.userId,
  period: { start: b.startAt, end: b.endAt }, purpose: b.purpose ?? null, status: b.status })) });
const asProto = Res.encode(Res.create({ data: rows.map((b) => ({ id: b.id, labId: b.labId, userId: b.userId,
  start: b.startAt, end: b.endAt, status: STATUS[b.status], purpose: b.purpose ?? '' })) })).finish();
console.log(`100 lượt đặt: JSON ${asJson.length} byte · Protobuf ${asProto.length} byte (${(100 * asProto.length / asJson.length).toFixed(0)}%)`);
const gz = (await import('node:zlib')).gzipSync;
console.log(`sau gzip:     JSON ${gz(asJson).length} byte · Protobuf ${gz(asProto).length} byte`);

const N = 2000;
const def = protoLoader.loadSync(PROTO, { keepCase: false, enums: String });
const { labflow } = grpc.loadPackageDefinition(def);
const client = new labflow.v1.Bookings('127.0.0.1:50051', grpc.credentials.createInsecure());
const call = () => new Promise((ok, no) => client.ListBookings({ limit: 20 }, (e, r) => (e ? no(e) : ok(r))));
await call();
let t = performance.now();
for (let i = 0; i < N; i++) await call();
const g = performance.now() - t;

const B = 'http://localhost:4000/v2';
const { accessToken } = await (await fetch(`${B}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json();
const get = async () => (await fetch(`${B}/bookings?limit=20`, { headers: { Authorization: `Bearer ${accessToken}` } })).json();
await get();
t = performance.now();
for (let i = 0; i < N; i++) await get();
const r = performance.now() - t;
console.log(`${N} lời gọi tuần tự, trang 20 lượt: gRPC ${(g / N).toFixed(3)} ms/lần · REST+JSON ${(r / N).toFixed(3)} ms/lần`);
client.close();
