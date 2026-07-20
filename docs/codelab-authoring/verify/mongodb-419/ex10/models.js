const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: String,
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
});
productSchema.index({ sku: 1 }, { unique: true });

const lineSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    customer: { type: String, required: true },
    lines: [lineSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);
orderSchema.index({ orderNumber: 1 }, { unique: true });

orderSchema.pre('validate', function (next) {
  this.total = this.lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
  next();
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
};
