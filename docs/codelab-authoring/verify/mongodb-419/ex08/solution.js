const mongoose = require('mongoose');
const crypto = require('crypto');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_hooks';

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastHashedBy: String,
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = hash(this.password);
  this.lastHashedBy = 'save-hook';
  next();
});

userSchema.post('save', function (doc) {
  console.log('post save:', doc.username);
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const set = update.$set || update;
  if (set.password) {
    set.password = hash(set.password);
    set.lastHashedBy = 'query-hook';
    this.setUpdate(update);
  }
  next();
});

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  const user = await User.create({ username: 'ada', password: 'secret12' });
  console.log('stored hash matches:', user.password === hash('secret12'));

  user.username = 'ada2';
  await user.save();
  console.log('password unchanged on rename:', user.password === hash('secret12'));

  const updated = await User.findOneAndUpdate(
    { username: 'ada2' },
    { $set: { password: 'newsecret' } },
    { new: true }
  );
  console.log('after query update matches:', updated.password === hash('newsecret'));
  console.log('lastHashedBy:', updated.lastHashedBy);

  const loose = await User.findOneAndUpdate({ username: 'ada2' }, { $set: { role: 'root' } }, { new: true });
  console.log('role now:', loose.role);

  try {
    await User.findOneAndUpdate({ username: 'ada2' }, { $set: { role: 'root' } }, { runValidators: true });
  } catch (err) {
    console.log('with runValidators:', err.name);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
