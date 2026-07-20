const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_indexes';

const accountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    tenant: { type: String, required: true },
    status: { type: String, default: 'active' },
    displayName: String,
  },
  { autoIndex: true }
);

accountSchema.index({ email: 1 }, { unique: true });
accountSchema.index({ tenant: 1, status: 1 });

const Account = mongoose.model('Account', accountSchema);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  await Account.init();
  const indexes = await Account.collection.indexes();
  console.log('indexes:', indexes.map((index) => index.name).sort().join(', '));

  await Account.create({ email: 'ada@example.com', tenant: 't1', displayName: 'Ada' });

  try {
    await Account.create({ email: 'ada@example.com', tenant: 't1', displayName: 'Ada again' });
  } catch (err) {
    console.log('error name:', err.name);
    console.log('code:', err.code);
    const [field, value] = Object.entries(err.keyValue)[0];
    console.log('duplicate field:', field);
    console.log('mapped:', field + ' already registered: ' + value);
    console.log('is ValidationError:', err instanceof mongoose.Error.ValidationError);
  }

  await Account.create([
    { email: 'grace@example.com', tenant: 't1', displayName: 'Grace' },
    { email: 'alan@example.com', tenant: 't1', displayName: 'Alan' },
  ]);

  const hydrated = await Account.findOne({ email: 'grace@example.com' });
  const lean = await Account.findOne({ email: 'grace@example.com' }).lean();

  console.log('hydrated is model:', hydrated instanceof Account);
  console.log('hydrated has save:', typeof hydrated.save === 'function');
  console.log('lean is model:', lean instanceof Account);
  console.log('lean has save:', typeof lean.save === 'function');
  console.log('lean constructor:', lean.constructor.name);

  const dropped = await Account.syncIndexes();
  console.log('dropped indexes:', dropped.length);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
