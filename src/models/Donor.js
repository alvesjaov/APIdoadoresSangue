import mongoose from 'mongoose';

const donorSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  Name: {
    type: String,
    required: true,
    not: null
  },
  CPF: {
    type: String,
    required: true,
    not: null
  },
  Age: {
    type: Number,
    required: true,
    not: null
  },
  Address: {
    type: String,
    required: true, 
    not: null
  },
  bloodType: {
    type: String,
    required: true,
    not: null,
  },
  donationHistory: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    donationDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    }
  }]
}, { versionKey: false });


donorSchema.pre('save', function (next) {
  if (this.donationHistory.length > 0) {
    const lastDonation = this.donationHistory[this.donationHistory.length - 1];
    lastDonation.donationDate = new Date(lastDonation.donationDate);
    lastDonation.expiryDate = new Date(lastDonation.donationDate.getTime() + 1 * 24 * 60 * 60 * 1000);
  }

  next();
});


export default mongoose.model('Donor', donorSchema);