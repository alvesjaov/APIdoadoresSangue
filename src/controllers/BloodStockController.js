import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js';

// Função para remover doações expiradas
async function removeExpiredDonations(currentDate) {
    // Atualiza todos os documentos Donor onde a data de validade é menor que a data atual
    // A operação $pull remove itens do array donationHistory que correspondem à condição especificada
    await Donor.updateMany(
        { 'donationHistory.expiryDate': { $lt: currentDate } },
        { $pull: { donationHistory: { expiryDate: { $lt: currentDate } } } }
    );
}

// Função para contar os tipos sanguíneos
async function countBloodTypes(currentDate) {
    // Realiza uma operação de agregação no modelo Donor
    const bloodTypeCounts = await Donor.aggregate([
        // Desagrupa o array donationHistory para que cada doação seja uma entrada separada
        { $unwind: '$donationHistory' },
        // Filtra os documentos onde a data de validade da doação é maior ou igual à data atual
        { $match: { 'donationHistory': { $gte: currentDate } } },
        // Agrupa os documentos por tipo sanguíneo e conta o número de doações para cada grupo
        { $group: { _id: '$bloodType', count: { $sum: 1 } } },
        // Ordena os resultados por tipo sanguíneo em ordem ascendente
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

    allBloodTypes.forEach(type => {
        const found = bloodTypeCounts.find(count => count._id === type);
        allCounts[type] = found ? found.count : 0;
    });

    return allCounts;
}

// Função para atualizar o estoque com as contagens
async function updateStock(allCounts) {
    await Stock.updateOne({}, { $set: allCounts }, { upsert: true });
}

// Função principal para contar e atualizar os tipos sanguíneos
async function countAndUpdateBloodTypes(request, response) {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        await removeExpiredDonations(currentDate);

        const bloodTypeCounts = await countBloodTypes(currentDate);

        const allCounts = prepareAllCounts(bloodTypeCounts);

        await updateStock(allCounts);

        response.status(200).json(allCounts);
    } catch (error) {
        console.log(error.message)
        response.status(500).send('Ocorreu um erro ao contar e atualizar os tipos sanguíneos. Por favor, tente novamente.');
    }
}

// Exportando a função countAndUpdateBloodTypes
export default countAndUpdateBloodTypes;
