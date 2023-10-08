import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js';

// Função para remover doações expiradas
async function removeExpiredDonations(currentDate) {
    // Atualiza todos os doadores removendo as doações expiradas de seu histórico de doações
    await Donor.updateMany(
        { donationHistory: { $elemMatch: { _id: { $exists: true }, expiryDate: { $lt: currentDate } } } },
        { $pull: { donationHistory: { _id: { $exists: true }, expiryDate: { $lt: currentDate } } } }
    );
}

// Função para contar os tipos sanguíneos
async function countBloodTypes(currentDate) {
    // Agrega os doadores por tipo sanguíneo e conta o número de doações não expiradas para cada tipo sanguíneo
    const bloodTypeCounts = await Donor.aggregate([
        { $unwind: '$donationHistory' },
        { $match: { 'donationHistory._id': { $exists: true }, 'donationHistory.expiryDate': { $gte: currentDate } } },
        { $group: { _id: '$bloodType', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    return bloodTypeCounts;
}

// Função para preparar a contagem de todos os tipos sanguíneos
function prepareAllCounts(bloodTypeCounts) {
    const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    let allCounts = {};
    allBloodTypes.forEach(type => {
        allCounts[type] = 0;
    });

    // Para cada tipo sanguíneo, encontra a contagem correspondente nos resultados da agregação e a atribui ao objeto allCounts
    allBloodTypes.forEach(type => {
        const found = bloodTypeCounts.find(count => count._id === type);
        allCounts[type] = found ? found.count : 0;
    });

    return allCounts;
}

// Função para atualizar o estoque com as contagens de todos os tipos sanguíneos
async function updateStock(allCounts) {
    // Atualiza o estoque com as contagens de todos os tipos sanguíneos
    await Stock.updateMany({}, allCounts, { upsert: true });

}

// Função principal para contar e atualizar os tipos sanguíneos
async function countAndUpdateBloodTypes(_, response) {
    try {
        const currentDate = new Date(); // Pega a data atual (data de hoje

        // Remove as doações expiradas
        await removeExpiredDonations(currentDate);

        // Conta os tipos sanguíneos
        const bloodTypeCounts = await countBloodTypes(currentDate);

        // Prepara a contagem de todos os tipos sanguíneos
        const allCounts = prepareAllCounts(bloodTypeCounts);

        // Atualiza o estoque com as contagens de todos os tipos sanguíneos
        await updateStock(allCounts);
        // Envia uma resposta com a contagem de todos os tipos sanguíneos
        response.status(200).json(allCounts);

    } catch (error) {
        // Em caso de erro, envia uma mensagem de erro
        response.status(500).json({ message: `Ocorreu um erro ao contar e atualizar os tipos sanguíneos. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

// Exporta a função principal
export default countAndUpdateBloodTypes