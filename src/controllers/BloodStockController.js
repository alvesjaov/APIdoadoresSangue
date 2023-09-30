import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js'; 

// Função assíncrona para contar e atualizar os tipos sanguíneos
async function countAndUpdateBloodTypes(request, response) {
    try {
        // Pega a data atual em formato ISO
        const currentDate = new Date().toISOString();

        // Conta o número de doadores para cada tipo sanguíneo cuja data de validade ainda não passou
        const bloodTypeCounts = await Donor.aggregate([
            { $match: { expiryDate: { $gte: currentDate } } }, // Filtra os doadores cuja data de validade ainda não passou
            { $group: { _id: '$bloodType', count: { $sum: 1 } } }, // Agrupa os doadores por tipo sanguíneo e conta o número de doadores para cada grupo
            { $sort: { _id: 1 } } // Ordena os resultados por tipo sanguíneo em ordem ascendente
        ]);

        // Cria um objeto com contagens para todos os tipos sanguíneos
        const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const allCounts = {};
        allBloodTypes.forEach(type => {
            const found = bloodTypeCounts.find(count => count._id === type); // Procura a contagem para o tipo sanguíneo atual
            allCounts[type] = found ? found.count : 0; // Se a contagem foi encontrada, usa ela. Caso contrário, usa 0.
        });

        // Atualiza as contagens no banco de dados
        await Stock.updateOne({}, {$set:allCounts}, { upsert: true }); // Atualiza um documento na coleção Stock com as novas contagens. Se nenhum documento existir, cria um novo (upsert: true).

        // Envia uma resposta com status 200 (OK) e as contagens como corpo da resposta
        response.status(200).json(allCounts);
    } catch (error) {
        // Se ocorrer algum erro, envia uma resposta com status 500 (Erro Interno do Servidor) e uma mensagem de erro.
        console.log(error.message)
        response.status(500).send('Ocorreu um erro ao contar e atualizar os tipos sanguíneos. Por favor, tente novamente.');
    }
}

// Exporta a função countAndUpdateBloodTypes
export { countAndUpdateBloodTypes };