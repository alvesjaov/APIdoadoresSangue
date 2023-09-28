import mongoose from 'mongoose';

const doadorSchema = mongoose.Schema({
  nome: String,
  idade: Number,
  tipoSanguineo: String,
  historicoDoacoes: [Date],
  endereco: String,
  contato: String
});

export default mongoose.model('Doador', doadorSchema);