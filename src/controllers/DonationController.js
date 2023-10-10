import Donor from '../models/Donor.js';

// Rota para criar uma doação (CREATE)
async function createDonation(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Procura pelo doador correspondente ao id fornecido
        const donor = await Donor.findById(id);
        if (!donor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            // Adiciona a data atual ao histórico de doações do doador
            donor.donationHistory.push({ donationDate: new Date().toISOString().slice(0, 10) });
            await donor.save(); // Salva o doador atualizado no banco de dados

            response.json({ message: `Nova doação registrada para o doador com ID ${id}!` }); // Retorna sucesso se a doação for registrada corretamente
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao registrar a doação. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

// Rota para deletar a última doação de um doador (DELETE)
async function deleteLastDonation(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Procura pelo doador correspondente ao id fornecido
        const donor = await Donor.findById(id);
        if (!donor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            // Se o doador tiver histórico de doações, remove a última
            if (donor.donationHistory.length > 0) {
                donor.donationHistory.pop();
                await donor.save(); // Salva o doador atualizado no banco de dados

                response.json({ message: `Última doação removida para o doador com ID ${id}!` }); // Retorna sucesso se a última doação for removida corretamente
            } else {
                response.json({ message: `O doador com ID ${id} não tem histórico de doações.` }); // Retorna uma mensagem se o doador não tiver histórico de doações
            }
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao remover a última doação do doador com ID ${id}. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

export { createDonation, deleteLastDonation } // Exporta as funções para serem usadas em outros arquivos