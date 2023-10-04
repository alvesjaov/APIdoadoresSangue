import mongoose from 'mongoose';
import formatDate from '../utils/Date.js';

const donorSchema = mongoose.Schema({
  Name: String,
  CPF: { type: String },
  Age: Number,
  bloodType: String,
  donationHistory: [String],
  Address: String,
  Contact: String,
  donationDate: { type: String },
  expiryDate: { type: String }
});

donorSchema.pre('save', function (next) {
  // Se houver doações no histórico de doações
  if (this.donationHistory.length > 0) {
    // Pega a data da última doação
    const lastDonationDate = this.donationHistory[this.donationHistory.length - 1];
    // Atualiza donationDate e expiryDate para a última doação
    this.donationDate = lastDonationDate;
    this.expiryDate = formatDate(new Date(new Date(lastDonationDate).getTime() + 2 * 24 * 60 * 60 * 1000));
  } else {
    // Se não houver doações, define donationDate e expiryDate como 'Não há doações'
    this.donationDate = 'Não há doações';
    this.expiryDate = 'Não há doações';
  }

  next();
});


export default mongoose.model('Donor', donorSchema);