const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_virtuals';

const fields = { firstName: String, lastName: String };

const userSchema = new mongoose.Schema(fields);

userSchema
  .virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function (value) {
    const index = value.indexOf(' ');
    this.firstName = value.slice(0, index);
    this.lastName = value.slice(index + 1);
  });

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

const jsonUserSchema = new mongoose.Schema(fields, { toJSON: { virtuals: true } });
jsonUserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

const User = mongoose.model('User', userSchema);
const JsonUser = mongoose.model('JsonUser', jsonUserSchema);
const Post = mongoose.model(
  'Post',
  new mongoose.Schema({ title: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  const user = new User({ firstName: 'Ada', lastName: 'Lovelace' });
  console.log('fullName:', user.fullName);

  user.fullName = 'Grace Hopper';
  console.log('after set:', user.firstName + ' / ' + user.lastName);
  await user.save();

  const plain = new JsonUser({ firstName: 'Grace', lastName: 'Hopper' });
  console.log('json has fullName:', JSON.stringify(user).includes('fullName'));
  console.log('json with virtuals has fullName:', JSON.stringify(plain).includes('fullName'));

  console.log('query by virtual matched:', await User.countDocuments({ fullName: 'Grace Hopper' }));

  const other = await User.create({ firstName: 'Alan', lastName: 'Turing' });
  await Post.create([
    { title: 'Sketch of the Analytical Engine', author: user._id },
    { title: 'Notes on the Engine', author: user._id },
    { title: 'Computing Machinery', author: other._id },
  ]);

  const withPosts = await User.findById(user._id).populate('posts');
  console.log('posts:', withPosts.posts.length);
  console.log(
    'titles:',
    withPosts.posts
      .map((post) => post.title)
      .sort()
      .join(', ')
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
