import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
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
  buyPrice: {
    type: Number,
    require: true,
  },
});

const Holding = mongoose.model('Holding', holdingSchema);

export default Holding;
