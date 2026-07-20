const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_populate';

const Publisher = mongoose.model('Publisher', new mongoose.Schema({ name: String }));
const Author = mongoose.model(
  'Author',
  new mongoose.Schema({ name: String, publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' } })
);
const Book = mongoose.model(
  'Book',
  new mongoose.Schema({ title: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' } })
);

let queries = 0;

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  const chilton = await Publisher.create({ name: 'Chilton' });
  const herbert = await Author.create({ name: 'Frank Herbert', publisher: chilton._id });
  const leguin = await Author.create({ name: 'Ursula Le Guin', publisher: chilton._id });
  await Book.create([
    { title: 'Dune', author: herbert._id },
    { title: 'Children of Dune', author: herbert._id },
    { title: 'A Wizard of Earthsea', author: leguin._id },
  ]);

  const raw = await Book.findOne({ title: 'Dune' });
  console.log('unpopulated author is ObjectId:', raw.author instanceof mongoose.Types.ObjectId);

  mongoose.set('debug', () => {
    queries += 1;
  });
  queries = 0;

  const books = await Book.find()
    .sort({ title: 1 })
    .populate({
      path: 'author',
      select: 'name -_id',
      populate: { path: 'publisher', select: 'name -_id' },
    });

  mongoose.set('debug', false);

  console.log('queries:', queries);
  for (const book of books) {
    console.log(book.title + ' / ' + book.author.name + ' / ' + book.author.publisher.name);
  }
  console.log('author has _id:', Boolean(books[0].author._id));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
