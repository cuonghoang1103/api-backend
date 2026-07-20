const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_methods';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['open', 'done'], default: 'open' },
  dueAt: Date,
  owner: String,
});

taskSchema.methods.markDone = function () {
  this.status = 'done';
  return this.save();
};

taskSchema.statics.findOverdue = function (now) {
  return this.find({ status: 'open', dueAt: { $lt: now } }).sort({ dueAt: 1 });
};

taskSchema.query.byOwner = function (owner) {
  return this.where({ owner: owner });
};

const Task = mongoose.model('Task', taskSchema);

const seed = [
  { title: 'pay rent', owner: 'ada', dueAt: new Date('2026-01-10') },
  { title: 'renew domain', owner: 'ada', dueAt: new Date('2026-02-01') },
  { title: 'write report', owner: 'bob', dueAt: new Date('2026-02-20') },
  { title: 'buy milk', owner: 'ada', dueAt: new Date('2026-06-01') },
  { title: 'archive logs', owner: 'bob', dueAt: new Date('2026-01-05'), status: 'done' },
];

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  await Task.create(seed);

  const task = await Task.findOne({ title: 'renew domain' });
  await task.markDone();
  console.log('after markDone:', task.status);

  const overdue = await Task.findOverdue(new Date('2026-03-01'));
  console.log('overdue:', overdue.map((doc) => doc.title).join(', '));

  const adaTasks = await Task.find().byOwner('ada').sort({ title: 1 });
  console.log('ada tasks:', adaTasks.map((doc) => doc.title).join(', '));

  const adaOpen = await Task.find({ status: 'open' }).byOwner('ada');
  console.log('ada open:', adaOpen.length);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
