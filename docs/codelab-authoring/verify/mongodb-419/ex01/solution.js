const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_connect';

async function main() {
  console.log('readyState before:', mongoose.connection.readyState);

  mongoose.connection.on('connected', () => console.log('event: connected'));
  mongoose.connection.on('error', (err) => console.log('event: error ->', err.name));
  mongoose.connection.on('disconnected', () => console.log('event: disconnected'));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('readyState after:', mongoose.connection.readyState);
  console.log('database:', mongoose.connection.name);

  const bad = mongoose.createConnection('mongodb://127.0.0.1:1/nope', { serverSelectionTimeoutMS: 300 });
  try {
    await bad.asPromise();
    console.log('bad connect unexpectedly succeeded');
  } catch (err) {
    console.log('bad connect rejected:', err.name);
  }
  await bad.close();

  await mongoose.disconnect();
  console.log('readyState final:', mongoose.connection.readyState);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
