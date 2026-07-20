const mongoose = require('mongoose');
const { Product, Order } = require('./models');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_tx?replicaSet=rs0';

async function printStock(label) {
  const a = await Product.findOne({ sku: 'SKU-A' }).lean();
  const b = await Product.findOne({ sku: 'SKU-B' }).lean();
  console.log(label + 'A=' + a.stock + ' B=' + b.stock);
}

async function placeOrder({ orderNumber, customer, items }) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const lines = [];
      for (const item of items) {
        const product = await Product.findOne({ sku: item.sku }).session(session);
        if (!product) throw new Error('unknown sku ' + item.sku);

        const res = await Product.updateOne(
          { _id: product._id, stock: { $gte: item.qty } },
          { $inc: { stock: -item.qty } },
          { session }
        );
        if (res.modifiedCount !== 1) throw new Error('insufficient stock for ' + item.sku);

        lines.push({ product: product._id, qty: item.qty, unitPrice: product.price });
      }
      await Order.create([{ orderNumber, customer, lines }], { session });
    });
    return { ok: true };
  } catch (err) {
    if (err.code === 11000) {
      return { ok: false, error: 'duplicate order number ' + orderNumber };
    }
    return { ok: false, error: err.message };
  } finally {
    await session.endSession();
  }
}

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  await Promise.all([Product.init(), Order.init()]);
  await Product.create([
    { sku: 'SKU-A', name: 'Widget', price: 10, stock: 5 },
    { sku: 'SKU-B', name: 'Gadget', price: 4, stock: 2 },
  ]);
  await printStock('stock: ');

  const first = await placeOrder({
    orderNumber: 'ORD-1001',
    customer: 'ada',
    items: [{ sku: 'SKU-A', qty: 2 }, { sku: 'SKU-B', qty: 1 }],
  });
  console.log('order1:', first.ok ? 'ok' : first.error);
  await printStock('stock: ');

  const dup = await placeOrder({
    orderNumber: 'ORD-1001',
    customer: 'bob',
    items: [{ sku: 'SKU-A', qty: 1 }],
  });
  console.log('duplicate:', dup.error);

  const oversell = await placeOrder({
    orderNumber: 'ORD-1003',
    customer: 'ada',
    items: [{ sku: 'SKU-A', qty: 1 }, { sku: 'SKU-B', qty: 9 }],
  });
  console.log('oversell:', oversell.error);
  await printStock('stock: ');

  const order = await Order.findOne({ orderNumber: 'ORD-1001' })
    .populate({ path: 'lines.product', select: 'sku -_id' })
    .lean();
  console.log('read back:', order.orderNumber, 'total=' + order.total);
  for (const line of order.lines) {
    console.log('line:', line.product.sku + ' x' + line.qty + ' @' + line.unitPrice);
  }
  console.log('lean has save:', typeof order.save === 'function');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
