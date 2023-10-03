import mongoose from 'mongoose';
import formatDate from '../utils/Date.js';

const donorSchema = mongoose.Schema({
  Name: String,
  Age: Number,
  bloodType: String,
  donationHistory: [String],
  Address: String,
  Contact: String,
  donationDate: { type: String },
  expiryDate: { type: String }
});

donorSchema.pre('save', function (next) {
  // Adiciona a data atual ao histórico de doações se houver alguma doação
  if (this.donationHistory.length > 0) {
    const currentDate = formatDate(new Date());
    // Atualiza donationDate e expiryDate
    this.donationDate = currentDate;
    this.expiryDate = formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000));
  } else {
    this.donationDate = 'Não há doações';
    this.expiryDate = 'Não há doações';
  }

  next();
});

export default mongoose.model('Donor', donorSchema);