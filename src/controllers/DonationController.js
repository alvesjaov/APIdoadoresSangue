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
            donor.donationHistory.push({ donationDate: new Date() });
            await donor.save(); // Salva o doador atualizado no banco de dados

            response.json({ message: `Nova doação registrada para o doador com ID ${id}!` }); // Retorna sucesso se a doação for registrada corretamente
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao registrar a doação. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

// Função assíncrona para adicionar exames de sangue (UPDATE)
async function addBloodExams(request, response) {
    // Desestruturação do corpo da requisição para obter os resultados dos exames de sangue
    const { bloodType, exams, examsResult } = request.body;

    // Pega o ID da doação da rota
    const { id } = request.params;

    try {
        // Procura um doador que tenha uma doação com o ID especificado
        const donor = await Donor.findOne({ "donationHistory._id": id });

        // Se o doador for encontrado, recupera a doação do histórico de doações do doador
        const donation = donor ? donor.donationHistory.id(id) : null;

        // Se o doador ou a doação não forem encontrados, retorna uma mensagem de erro
        if (!donor || !donation) {
            return response.status(404).json({ message: `Doação não encontrada` });
        }

        // Verifica se já existe um bloodTest para a doação atual
        if (donation.bloodTest && donation.bloodTest.length > 0) {
            return response.status(400).json({ message: `Já existe um exame de sangue para esta doação.` });
        }

        // Cria um novo objeto bloodTest
        const newBloodTest = {
            bloodType: bloodType,
            exams: exams,
            examsResult: examsResult
        };

        // Adiciona o novo objeto bloodTest ao array bloodTest da doação
        donation.bloodTest.push(newBloodTest);

        // Salva o documento doador atualizado no banco de dados
        await donor.save();

        // Retorna uma resposta indicando que os exames de sangue foram adicionados com sucesso
        response.status(200).json({ message: `Tipagem sanguínea e exames adicionados com sucesso` });
    } catch (error) {
        // Em caso de erro, retorna uma mensagem de erro
        response.status(500).json({ message: `Ocorreu um erro ao adicionar a tipagem sanguínea e os exames. Por favor, tente novamente. Erro: ${error.message}` });
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

export { createDonation, addBloodExams, deleteLastDonation } // Exporta as funções para serem usadas em outros arquivos