import mongoose from 'mongoose';
import Donor from '../models/Donor.js';

// Função auxiliar para buscar doador por ID ou nome
async function findDonorByIdOrName(idOrName) {
    let donor;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
        donor = await Donor.findOne({ _id: idOrName });
        if (!donor) {
            throw new Error('ID não corresponde a nenhum doador');
        }
    } else {
        // Use uma expressão regular para permitir a busca pela letra inicial do nome
        // A opção 'i' torna a busca insensível a maiúsculas e minúsculas
        donor = await Donor.find({ name: { $regex: '^' + idOrName, $options: 'i' } });
        if (!donor) {
            throw new Error('Nome não corresponde a nenhum doador');
        }
    }
    return donor;
}

export { findDonorByIdOrName };