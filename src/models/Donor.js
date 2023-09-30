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

donorSchema.pre('save', function(next) {
  // Formata a data de doação
  this.donationDate = formatDate(new Date());

  // Adiciona 35 dias à data de doação para calcular a data de validade
  this.expiryDate = formatDate(new Date(Date.now() + 35*24*60*60*1000));

  next();
});

export default mongoose.model('Donor', donorSchema);
