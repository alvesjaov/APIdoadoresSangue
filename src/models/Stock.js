import mongoose from 'mongoose';

const stockSchema = mongoose.Schema({
  'A +(Pos)': { type: Number, default: 0 },
  'A -(Neg)': { type: Number, default: 0 },
  'B +(Pos)': { type: Number, default: 0 },
  'B -(Neg)': { type: Number, default: 0 },
  'AB +(Pos)': { type: Number, default: 0 },
  'AB -(Neg)': { type: Number, default: 0 },
  'O +(Pos)': { type: Number, default: 0 },
  'O -(Neg)': { type: Number, default: 0 }
}, { versionKey: false });

export default mongoose.model('Stock', stockSchema);