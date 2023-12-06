import Donor from '../models/Donor.js';

// Rota para criar uma doação (CREATE)
async function createDonation(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Procura pelo doador correspondente ao id fornecido
        const donor = await Donor.findById(id);
        if (!donor) {
            response.status(404).json({ error: `ID ${id} não corresponde a nenhum doador` });
        } else {
            // Adiciona a data atual ao histórico de doações do doador
            donor.donationHistory.push({ donationDate: new Date() });
            await donor.save(); // Salva o doador atualizado no banco de dados

            response.status(201).json({ message: `Nova doação registrada para o doador com ID ${id}!` }); // Retorna sucesso se a doação for registrada corretamente
        }
    } catch (error) {
        response.status(500).json({ error: "Ocorreu um erro ao registrar a doação, tente novamente." });
    }
}

// Rota para ler uma doação específica (READ)
async function readDonation(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição

    try {
        // Procura pelo doador que tem uma doação com o id fornecido
        const donor = await Donor.findOne({ "donationHistory._id": id });

        // Se o doador for encontrado, recupera a doação do histórico de doações do doador
        const donation = donor ? donor.donationHistory.id(id) : null;

        // Se o doador ou a doação não forem encontrados, retorna uma mensagem de erro
        if (!donor || !donation) {
            return response.status(404).json({ error: `Doação não encontrada` });
        }

        // Retorna a doação
        response.status(200).json(donation);
    } catch (error) {
        // Em caso de erro, retorna uma mensagem de erro
        response.status(500).json({ error: "Ocorreu um erro ao buscar a doação. Por favor, tente novamente" });
    }
}

// função para retorna doações que
async function readAllDonations(request, response) {
    try {
        // Encontra todos os doadores que possuem histórico de doações
        const donorsWithDonations = await Donor.find({ donationHistory: { $exists: true, $ne: [] } }, { _id: 1, name: 1, donationHistory: 1 });

        // Filtra as doações onde o campo bloodTest é um array vazio
        const donationsWithEmptyBloodTest = donorsWithDonations.reduce((donations, donor) => {
            const donationsWithEmptyTest = donor.donationHistory.filter(donation => {
                return Array.isArray(donation.bloodTest) && donation.bloodTest.length === 0;
            });
            if (donationsWithEmptyTest.length > 0) {
                donations.push({ donorId: donor._id, donorName: donor.name, donations: donationsWithEmptyTest });
            }
            return donations;
        }, []);

        // Verifica se há doações com bloodTest vazio
        if (donationsWithEmptyBloodTest.length === 0) {
            return response.status(404).json({ error: `Nenhuma doação com bloodTest vazio encontrada` });
        }

        // Retorna as doações com bloodTest vazio e os IDs e nomes dos doadores
        response.status(200).json(donationsWithEmptyBloodTest);
    } catch (error) {
        // Em caso de erro, retorna uma mensagem de erro
        response.status(500).json({ error: "Ocorreu um erro ao buscar doações com bloodTest vazio. Por favor, tente novamente" });
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
            return response.status(404).json({ error: `Doação não encontrada` });
        }

        // Verifica se já existe um bloodTest para a doação atual
        if (donation.bloodTest && donation.bloodTest.length > 0) {
            return response.status(400).json({ error: `Já existe um exame de sangue para esta doação.` });
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
        console.log(error.message);
        response.status(500).json({ error: "Ocorreu um erro ao adicionar a tipagem sanguínea e os exames, tente novamente." });
    }
}

// Função assíncrona para deletar uma doação específica (DELETE)
async function deleteDonation(request, response) {
    const { id } = request.params; // Pega o id da doação dos parâmetros da requisição

    try {
        // Procura um doador que tenha uma doação com o ID especificado
        const donor = await Donor.findOne({ "donationHistory._id": id });

        // Se o doador for encontrado, recupera a doação do histórico de doações do doador
        const donation = donor ? donor.donationHistory.id(id) : null;

        // Se o doador ou a doação não forem encontrados, retorna uma mensagem de erro
        if (!donor || !donation) {
            return response.status(404).json({ error: `Doação não encontrada` });
        }

        // Remove a doação específica
        donor.donationHistory.pull(id);

        // Salva o documento doador atualizado no banco de dados
        await donor.save();

        // Retorna uma resposta indicando que a doação foi deletada com sucesso
        response.status(200).json({ message: `Doação com ID ${id} deletada com sucesso!` });
    } catch (error) {
        // Em caso de erro, retorna uma mensagem de erro
        //console.log(error.message);
        response.status(500).json({ error: `Ocorreu um erro ao deletar a doação com ID ${id}, tente novamente.` });
    }
}

export { createDonation, readDonation, addBloodExams, deleteDonation ,readAllDonations} // Exporta as funções para serem usadas em outros arquivos