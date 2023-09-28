import mongoose from 'mongoose';

const donorSchema = mongoose.Schema({
  Name: String, 
  Age: Number, 
  bloodType: String, 
  donationHistory: [Date], 
  Address: String, 
  Contact: String 
});

export default mongoose.model('Donor', donorSchema);
