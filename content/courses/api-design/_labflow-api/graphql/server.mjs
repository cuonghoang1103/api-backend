// graphql/server.mjs — bài 7.5: CÙNG dữ liệu LabFlow, nhưng qua GraphQL (cổng 4001)
// GQL_LOADER=1 ⇒ gom truy vấn bằng DataLoader; mặc định: mỗi resolver tự truy vấn (để thấy N+1)
import express from 'express';
import DataLoader from 'dataloader';
import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { labs, devices, bookings } from '../src/db.js';

let dbCalls = 0;   // mỗi lần "hỏi cơ sở dữ liệu" (ở Chương 12 là một câu SQL)
const db = {
  allLabs: () => { dbCalls++; return labs.filter((l) => !l.retiredAt); },
  lab: (id) => { dbCalls++; return labs.find((l) => l.id === id) ?? null; },
  devicesOfLabs: (ids) => { dbCalls++; return ids.map((id) => devices.filter((d) => d.labId === id)); },
  bookingsOfLabs: (ids) => { dbCalls++; return ids.map((id) => bookings.filter((b) => b.labId === id)); },
};

const schema = buildSchema(`
  type Query { labs: [Lab!]!  lab(id: ID!): Lab }
  type Lab { id: ID!  code: String!  name: String!  capacity: Int!  devices: [Device!]!  bookings(limit: Int = 5): [Booking!]! }
  type Device { id: ID!  name: String!  status: String! }
  type Booking { id: ID!  start: String!  end: String!  status: String!  purpose: String  lab: Lab! }
`);

const loaders = () => ({
  devices: new DataLoader(async (ids) => db.devicesOfLabs(ids)),
  bookings: new DataLoader(async (ids) => db.bookingsOfLabs(ids)),
  lab: new DataLoader(async (ids) => { dbCalls++; return ids.map((id) => labs.find((l) => l.id === id) ?? null); }),
});
const useLoader = process.env.GQL_LOADER === '1';
const LabType = (l, ctx) => ({
  ...l,
  devices: () => (useLoader ? ctx.l.devices.load(l.id) : db.devicesOfLabs([l.id])[0]),
  bookings: async ({ limit }) => (useLoader ? await ctx.l.bookings.load(l.id) : db.bookingsOfLabs([l.id])[0])
    .slice(0, limit).map((b) => BookingType(b, ctx)),
});
const BookingType = (b, ctx) => ({
  id: b.id, start: b.startAt, end: b.endAt, status: b.status, purpose: b.purpose ?? null,
  lab: async () => LabType(useLoader ? await ctx.l.lab.load(b.labId) : db.lab(b.labId), ctx),
});
const rootValue = {
  labs: (args, ctx) => db.allLabs().map((l) => LabType(l, ctx)),
  lab: ({ id }, ctx) => { const l = db.lab(id); return l && LabType(l, ctx); },
};

const app = express();
app.all('/graphql', (req, res, next) => { dbCalls = 0; res.on('finish', () => console.log(`db calls: ${dbCalls}`)); next(); },
  createHandler({ schema, rootValue, context: () => ({ l: loaders() }) }));
app.get('/stats', (req, res) => res.json({ dbCalls }));
app.listen(4001, () => console.log(`GraphQL on :4001/graphql (DataLoader ${useLoader ? 'BẬT' : 'TẮT'})`));
