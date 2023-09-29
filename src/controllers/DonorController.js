import Donor from '../models/Donor.js';
import moment from 'moment-timezone';

// Rota para cadastrar doador (CREATE)
async function createDonor(request, response) {
    // Cria um novo doador com os dados da requisição
    const newDonor = new Donor(request.body);
    try {
        // Salva o novo doador no banco de dados
        await newDonor.save();
        // Envia uma resposta de sucesso
        response.status(201).send('Doador cadastrado com sucesso!');
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        response.status(500).send('Ocorreu um erro ao cadastrar o doador. Por favor, tente novamente.', error.message);
    }
}

// Rota para obter doadores (READ)
async function getDonors(request, response) {
    // Extrai o nome dos parâmetros da requisição
    const { name } = request.params;

    try {
        let donors;
        if (name) {
            // Pesquisa por nome, se fornecido
            donors = await Donor.find({ Name: name });
        } else {
            // Retorna todos os doadores se nenhum nome for fornecido
            donors = await Donor.find();
        }

        if (donors.length === 0) {
            // Envia uma resposta de erro se nenhum doador for encontrado
            response.status(404).json('Nenhum doador encontrado');
        } else {
            // Envia uma resposta com os doadores encontrados
            response.status(200).json(donors);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        response.status(500).send('Ocorreu um erro ao buscar doadores. Por favor, tente novamente.', error.message);
    }
}

// Rota para criar uma doação (CREATE)
async function createDonation(request, response) {
    // Extrai o ID dos parâmetros da requisição
    const { id } = request.params;
    try {
        // Encontra o doador pelo ID
        const donor = await Donor.findById(id);
        if (!donor) {
            // Envia uma resposta de erro se o doador não for encontrado
            response.status(404).json('Doador não encontrado');
        } else {
            // Adiciona a data atual ao histórico de doações
            donor.donationHistory.push(moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss'));
            // Salva o doador atualizado no banco de dados
            await donor.save();
            // Envia uma resposta de sucesso
            response.send(`Nova doação registrada para o doador com ID ${id}!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        response.status(500).send('Ocorreu um erro ao registrar a doação. Por favor, tente novamente.', error.message);
    }
}

// Rota para atualizar um doador (UPDATE)
async function updateDonor(request, response) {
    // Extrai o ID dos parâmetros da requisição
    const { id } = request.params;
    try {
        // Atualiza o doador no banco de dados com os novos dados da requisição
        const updatedDonor = await Donor.findByIdAndUpdate(id, request.body, { new: true });
        if (!updatedDonor) {
            // Envia uma resposta de erro se o doador não for encontrado
            response.status(404).json('Doador não encontrado');
        } else {
            // Envia uma resposta de sucesso
            response.send(`Doador com ID ${id} atualizado com sucesso!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        response.status(500).send('Ocorreu um erro ao atualizar o doador. Por favor, tente novamente.', error.message);
    }
}

// Rota para deletar um doador (DELETE)
async function deleteDonor(request, response) {
    // Extrai o ID dos parâmetros da requisição
    const { id } = request.params;
    try {
        // Remove o doador do banco de dados pelo ID
        const removedDonor = await Donor.findByIdAndRemove(id);
        if (!removedDonor) {
            // Envia uma resposta de erro se o doador não for encontrado
            response.status(404).json('Doador não encontrado');
        } else {
            // Envia uma resposta de sucesso
            response.send(`Doador com ID ${id} removido com sucesso!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        response.status(500).send('Ocorreu um erro ao remover o doador. Por favor, tente novamente.', error.message);
    }
}

// Exporta as funções para serem usadas em outros arquivos
export { getDonors, createDonor, createDonation, updateDonor, deleteDonor };