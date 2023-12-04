import mongoose from 'mongoose';
import Donor from '../models/Donor.js';

// Função auxiliar para buscar doador por ID ou nome
async function findDonorByIdOrName(idOrName) {
    try {
        if (mongoose.Types.ObjectId.isValid(idOrName)) {
            return await Donor.findOne({ _id: idOrName });
        } else {
            const regexString = `^${idOrName}`;
            const regex = new RegExp(regexString, 'i');
            return await Donor.find({ name: regex });
        }
    } catch (error) {
        console.error(error.message);
        throw new Error('Erro ao buscar doador. Tente novamente.');
    }
}

export { findDonorByIdOrName };
