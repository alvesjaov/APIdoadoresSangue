import mongoose from 'mongoose';

const donorSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
    not: null
  },
  CPF: {
    type: String,
    required: true,
    not: null
  },
  age: {
    type: Number,
    required: true,
    not: null
  },
  sex: {
    type: String,
    required: true,
    not: null
  },
  address: {
    type: String,
    required: true,
    not: null
  },
  telephone: {
    type: String,
    required: true,
    not: null
  },
  donationHistory: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    donationDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
    nextDonationDate: {
      type: Date,
    },
    bloodTypeResult: {
      type: String
    },
    exams: {
      type: [String]
    },
    examsResult: {
      type: String
    }
  }]
}, { versionKey: false });


donorSchema.pre('save', function (next) {
  if (this.donationHistory.length > 0) {
    const lastDonation = this.donationHistory[this.donationHistory.length - 1];
    lastDonation.donationDate = new Date();

    // Calcular a próxima data de doação com base no sexo do doado
    const nextDonationDelay = this.sex === 'M' ? 3 : 4;
    lastDonation.nextDonationDate = new Date(new Date().getTime() + nextDonationDelay * 30 * 24 * 60 * 60 * 1000);

    // Definir a data de validade para a doação
    lastDonation.expiryDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);

  }

  next();
});

export default mongoose.model('Donor', donorSchema);