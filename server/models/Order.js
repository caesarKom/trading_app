import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  remainingBalance: {
    type: Number,
    require: true,
    set: function (value) {
      return parseFloat(value.toFixed(2));
    },
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
