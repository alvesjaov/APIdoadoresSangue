import mongoose from 'mongoose';

const stockSchema = mongoose.Schema({
  'A+': { type: Number, default: 0 },
  'A-': { type: Number, default: 0 },
  'B+': { type: Number, default: 0 },
  'B-': { type: Number, default: 0 },
  'AB+': { type: Number, default: 0 },
  'AB-': { type: Number, default: 0 },
  'O+': { type: Number, default: 0 },
  'O-': { type: Number, default: 0 }
});


export default mongoose.model('Stock', stockSchema);
