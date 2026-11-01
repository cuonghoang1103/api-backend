// grpc/client.mjs — gọi thử: một trang lượt đặt, rồi nghe luồng của một phòng
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const def = protoLoader.loadSync(new URL('./labflow.proto', import.meta.url).pathname, { keepCase: false, enums: String });
const { labflow } = grpc.loadPackageDefinition(def);
const client = new labflow.v1.Bookings('127.0.0.1:50051', grpc.credentials.createInsecure());

client.ListBookings({ labId: 'lab_2', limit: 2 }, (err, res) => {
  if (err) return console.log('lỗi', err.code, err.details);
  console.log(JSON.stringify(res));
  const t0 = Date.now();
  client.WatchLab({ labId: 'lab_1' })
    .on('data', (b) => console.log(`+${Date.now() - t0} ms`, b.id, b.status, b.start))
    .on('end', () => { console.log('luồng đóng'); client.close(); });
});
