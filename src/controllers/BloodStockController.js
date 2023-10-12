import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js';

async function countBloodTypes(currentDate) {
    // Agrega os doadores por tipo sanguíneo e conta o número de doações não expiradas para cada tipo sanguíneo
    const bloodTypeCounts = await Donor.aggregate([
        { $unwind: '$donationHistory' },
        { $unwind: '$donationHistory.bloodTest' },
        { $match: { 'donationHistory._id': { $exists: true }, 'donationHistory.expiryDate': { $gte: currentDate }, 'donationHistory.bloodTest._id': { $exists: true } } },
        { $group: { _id: '$donationHistory.bloodTest.bloodType', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    return bloodTypeCounts;
}

// Função para preparar a contagem de todos os tipos sanguíneos
function prepareAllCounts(bloodTypeCounts) {
    const allBloodTypes = ['A +(Pos)', 'A -(Neg)', 'B +(Pos)', 'B -(Neg)', 'AB +(Pos)', 'AB -(Neg)', 'O +(Pos)', 'O -(Neg)'];
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
        const currentDate = new Date(); // Pega a data atual (data de hoje)

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

export default countAndUpdateBloodTypes // Exporta a função principal