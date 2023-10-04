// Importa os modelos Donor e Stock
import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js';

// Função assíncrona para contar e atualizar os tipos sanguíneos
async function countAndUpdateBloodTypes(request, response) {
    try {
        // Pega a data atual e converte para uma string no formato "AAAA-MM-DD"
        const currentDate = new Date().toISOString().split('T')[0];

        // Primeiro, exclua todas as doações que já expiraram
        await Donor.updateMany(
            { expiryDate: { $lt: currentDate } },
            { $pull: { donationHistory: { expiryDate: { $lt: currentDate } } } }
        );
        console.log('Doações expiradas removidas.', currentDate);

        // Realiza uma operação de agregação no modelo Donor
        const bloodTypeCounts = await Donor.aggregate([
            // Adiciona um novo campo expiryDate que contém apenas a parte da data de expiryDate
            { $addFields: { expiryDate: { $substr: ["$expiryDate", 0, 10] } } },
            // Filtra os documentos onde expiryDate é maior ou igual à currentDate
            { $match: { expiryDate: { $gte: currentDate } } },
            // Desagrupa o array donationHistory para que cada doação seja uma entrada separada
            { $unwind: '$donationHistory' },
            // Agrupa os documentos por tipo sanguíneo e conta o número de doações para cada grupo
            { $group: { _id: '$bloodType', count: { $sum: 1 } } },
            // Ordena os resultados por tipo sanguíneo em ordem ascendente
            { $sort: { _id: 1 } }
        ]);
        console.log('Contagem de tipos sanguíneos realizada.', bloodTypeCounts);



        // Define todos os tipos sanguíneos possíveis
        const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const allCounts = {};
        // Para cada tipo sanguíneo, encontra a contagem correspondente nos resultados da agregação
        allBloodTypes.forEach(type => {
            const found = bloodTypeCounts.find(count => count._id === type);
            // Se a contagem foi encontrada, usa ela. Caso contrário, usa 0.
            allCounts[type] = found ? found.count : 0;
        });

        // Atualiza as contagens no modelo Stock. Se nenhum documento existir, cria um novo (upsert: true).
        await Stock.updateOne({}, { $set: allCounts }, { upsert: true });

        // Envia uma resposta com status 200 (OK) e as contagens como corpo da resposta
        response.status(200).json(allCounts);
    } catch (error) {
        // Se ocorrer algum erro, registra a mensagem de erro no console e envia uma resposta com status 500 (Erro Interno do Servidor)
        console.log(error.message)
        response.status(500).send('Ocorreu um erro ao contar e atualizar os tipos sanguíneos. Por favor, tente novamente.');
    }
}

// Exporta a função countAndUpdateBloodTypes
export default countAndUpdateBloodTypes;