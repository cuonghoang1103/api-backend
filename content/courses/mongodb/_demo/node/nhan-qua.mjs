// Bài 6.4 — session nhân quả trong Node: ghi rồi đọc lại với readPreference secondaryPreferred (trên lab 1 thành viên: đọc rơi về primary).
// Chạy: node nhan-qua.mjs
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const userId = 'U001';
const session = client.startSession({ causalConsistency: true });
const ho = client.db('shop').collection('hoSo', {
  readConcern: { level: 'majority' }, writeConcern: { w: 'majority' }, readPreference: 'secondaryPreferred' });
await ho.updateOne({ _id: userId }, { $set: { ten: 'Cường' } }, { session, upsert: true });
const moi = await ho.findOne({ _id: userId }, { session });   // chờ tới khi thành viên được hỏi đã có lần ghi trên
console.log('đọc lại:', JSON.stringify(moi), '| operationTime của session:', session.operationTime?.toString());
await session.endSession();
await client.db('shop').dropDatabase();
await client.close();
