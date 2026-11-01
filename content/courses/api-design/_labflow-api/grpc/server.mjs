// grpc/server.mjs — cùng dữ liệu LabFlow qua gRPC (cổng 50051, HTTP/2)
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { bookings } from '../src/db.js';

const def = protoLoader.loadSync(new URL('./labflow.proto', import.meta.url).pathname, { keepCase: false, enums: String });
const { labflow } = grpc.loadPackageDefinition(def);
const toMsg = (b) => ({ id: b.id, labId: b.labId, userId: b.userId, start: b.startAt, end: b.endAt, status: b.status, purpose: b.purpose ?? '' });

const server = new grpc.Server();
server.addService(labflow.v1.Bookings.service, {
  ListBookings({ request }, done) {
    const limit = Math.min(request.limit || 20, 100);
    const from = Number(request.cursor || 0);
    const rows = bookings.filter((b) => !request.labId || b.labId === request.labId);
    const page = rows.slice(from, from + limit);
    done(null, { data: page.map(toMsg), nextCursor: from + limit < rows.length ? String(from + limit) : '' });
  },
  WatchLab(call) {   // gửi 3 lượt đặt, mỗi lượt cách 200 ms, rồi đóng luồng
    const rows = bookings.filter((b) => b.labId === call.request.labId).slice(0, 3);
    rows.forEach((b, i) => setTimeout(() => { call.write(toMsg(b)); if (i === rows.length - 1) call.end(); }, 200 * (i + 1)));
  },
});
server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => console.log('gRPC on 127.0.0.1:50051'));
