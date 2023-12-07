import Donor from '../models/Donor.js';

// Função assíncrona para adicionar exames de sangue (UPDATE)
async function addBloodTest(request, response) {
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


// função para ler todas as doações com bloodTest vazio (READ)
async function readDonationsWithEmptyBloodTest(request, response) {

    const page = parseInt(request.query.page) || 1; // Pega o número da página da query, padrão é 1
    const limit = 5; // Define o limite de itens por página
    const skip = (page - 1) * limit; // Calcula o número de itens a serem pulados

    try {
        // Encontra todos os doadores que possuem histórico de doações com paginação
        const donorsWithDonations = await Donor.find({ donationHistory: { $exists: true, $ne: [] } }, { _id: 1, name: 1, donationHistory: 1 })
            .skip(skip)
            .limit(limit);
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
            // Retorna um array vazio
            return response.status(200).json([]);
        }

        // Retorna as doações com bloodTest vazio e os IDs e nomes dos doadores
        response.status(200).json(donationsWithEmptyBloodTest);
    } catch (error) {
        // Em caso de erro, retorna uma mensagem de erro
        response.status(500).json({ error: "Ocorreu um erro ao buscar doações com bloodTest vazio. Por favor, tente novamente" });
    }
}

export { addBloodTest, readDonationsWithEmptyBloodTest } // Exporta as funções para serem usadas em outros arquivos
