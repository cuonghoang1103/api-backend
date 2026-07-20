const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_models';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    pages: Number,
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  console.log('collection:', Book.collection.name);

  const book = new Book({ title: 'The Pragmatic Programmer', author: 'Hunt and Thomas', pages: 352 });
  await book.save();

  await Book.create({ title: 'Refactoring', author: 'Fowler', pages: 448, published: true });

  console.log('title:', book.title);
  console.log('published default:', book.published);
  console.log('__v:', book.__v);
  console.log('createdAt is Date:', book.createdAt instanceof Date);
  console.log('id is ObjectId:', book._id instanceof mongoose.Types.ObjectId);

  console.log('count:', await Book.countDocuments());
  const titles = await Book.find().sort({ title: 1 }).select('title -_id');
  console.log('titles:', titles.map((doc) => doc.title).join(', '));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
