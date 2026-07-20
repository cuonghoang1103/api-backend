const mongoose = require('mongoose');

const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mg419_validation';

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[A-Z]{3}-\d{4}$/.test(value),
      message: 'SKU must look like ABC-1234',
    },
  },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['book', 'tool', 'toy'] },
  stock: { type: Number, default: 0 },
  discount: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return value <= this.price;
      },
      message: 'discount cannot exceed price',
    },
  },
});

const Product = mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  const valid = await Product.create({ sku: 'ABC-1234', price: 20, category: 'tool' });
  console.log('stock default:', valid.stock);

  try {
    await new Product({ sku: 'abc1', price: -5, category: 'gadget' }).save();
  } catch (err) {
    console.log('name:', err.name);
    console.log('paths:', Object.keys(err.errors).sort().join(', '));
    console.log('sku message:', err.errors.sku.message);
    console.log('price kind:', err.errors.price.kind);
  }

  try {
    await new Product({ sku: 'XYZ-0001', price: 10, category: 'toy', discount: 15 }).save();
  } catch (err) {
    console.log('discount message:', err.errors.discount.message);
  }

  console.log('saved count:', await Product.countDocuments());

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
