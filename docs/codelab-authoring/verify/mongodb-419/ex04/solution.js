const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_nested';

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  shipping: addressSchema,
  items: [itemSchema],
});

const Order = mongoose.model('Order', orderSchema);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  const order = new Order({
    customer: 'ada',
    shipping: { street: '12 Ly Thai To', city: 'Hanoi', zip: '10000' },
    items: [{ name: 'Keyboard', qty: 1, price: 30 }],
  });
  await order.save();

  order.items.push({ name: 'Cable', qty: 3, price: 5 });
  await order.save();

  console.log('items:', order.items.length);
  console.log('item has _id:', Boolean(order.items[0]._id));
  console.log('shipping has _id:', Boolean(order.shipping._id));

  const secondId = order.items[1]._id;
  console.log('second item qty:', order.items.id(secondId).qty);

  const total = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  console.log('total:', total);
  console.log('shipping city:', order.shipping.city);

  order.items.push({ name: 'Mat', qty: 0, price: 9 });
  try {
    await order.save();
  } catch (err) {
    console.log('invalid path:', Object.keys(err.errors).join(', '));
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
