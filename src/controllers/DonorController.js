import Donor from '../models/Donor.js';
import formatDate from '../utils/Date.js';
import Stock from '../models/Stock.js';
import ValidateCPF from '../utils/ValidateCPF.js';

// Rota para cadastrar doador (CREATE)
async function createDonor(request, response) {
    // Cria um novo doador com os dados da requisição
    const donorData = request.body;
    // Verifica se donationHistory existe, se não, inicializa como um array vazio
    donorData.donationHistory = donorData.donationHistory || [];
    // Adiciona a data atual ao histórico de doações
    donorData.donationHistory.push(formatDate(new Date()));
    const newDonor = new Donor(donorData);

    try {
        // Verifica se o CPF é válido
        if (!ValidateCPF(donorData.CPF)) {
            return response.status(400).send('O CPF fornecido não é válido.');
        }

        // Verifica se o doador já existe no banco de dados
        const existingDonor = await Donor.findOne({CPF: donorData.CPF});
        if (existingDonor) {
            // Se o doador já existir, envia uma resposta de erro
            return response.status(400).send('Um doador com os mesmos dados já existe.');
        }

        // Salva o novo doador no banco de dados
        await newDonor.save();
        // Envia uma resposta de sucesso
        response.status(201).send('Doador cadastrado com sucesso!');
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message)
        response.status(500).send('Ocorreu um erro ao cadastrar o doador. Por favor, tente novamente.');
    }
}

// Rota para obter doadores (READ)
async function getDonors(request, response) {
    // Extrai o id dos parâmetros da requisição
    const { id } = request.params;

    try {
        let donor;
        if (id) {
            // Pesquisa por id, se fornecido
            donor = await Donor.findById(id, { __v: 0 });
        } else {
            // Retorna todos os doadores se nenhum id for fornecido
            let donors = await Donor.find({}, { __v: 0 });
            // Verifica se a lista de doadores está vazia
            if (donors.length === 0) {
                // Se estiver vazia, retorna uma mensagem informando que nenhum doador foi encontrado
                return response.status(404).json('Nenhum doador encontrado');
            }
            // Se a lista de doadores não estiver vazia, retorna a lista de doadores
            return response.status(200).json(donors);
        }

        if (!donor) {
            // Envia uma resposta de erro se nenhum doador for encontrado
            response.status(404).json(`ID ${id} não corresponde a nenhum doador`);
        } else {
            // Envia uma resposta com o doador encontrado
            response.status(200).json(donor);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message)
        response.status(500).send('Ocorreu um erro ao buscar doadores. Por favor, tente novamente.');
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
            response.status(404).json(`ID ${id} não corresponde a nenhum doador`);
        } else {
            // Adiciona a data atual ao histórico de doações
            donor.donationHistory.push(formatDate(new Date()));
            // Salva o doador atualizado no banco de dados
            await donor.save();
            // Envia uma resposta de sucesso
            response.send(`Nova doação registrada para o doador com ID ${id}!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message);
        response.status(500).send('Ocorreu um erro ao registrar a doação. Por favor, tente novamente.');
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
            response.status(404).json(`ID ${id} não corresponde a nenhum doador`);
        } else {
            // Envia uma resposta de sucesso
            response.send(`Doador com ID ${id} atualizado com sucesso!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message);
        response.status(500).send('Ocorreu um erro ao atualizar o doador. Por favor, tente novamente.');
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
            response.status(404).json(`ID ${id} não corresponde a nenhum doador`);
        } else {
            // Envia uma resposta de sucesso
            response.send(`Doador com ID ${id} removido com sucesso!`);
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message);
        response.status(500).send('Ocorreu um erro ao remover o doador. Por favor, tente novamente.');
    }
}

// Rota para deletar a última doação de um doador
async function deleteLastDonation(request, response) {
    // Extrai o ID dos parâmetros da requisição
    const { id } = request.params;
    try {
        // Encontra o doador pelo ID
        const donor = await Donor.findById(id);
        if (!donor) {
            // Envia uma resposta de erro se o doador não for encontrado
            response.status(404).json(`ID ${id} não corresponde a nenhum doador`);
        } else {
            // Verifica se o doador tem um histórico de doações
            if (donor.donationHistory.length > 0) {
                // Remove a última doação do histórico de doações
                donor.donationHistory.pop();
                // Salva o doador atualizado no banco de dados
                await donor.save();

                // Atualiza o estoque de sangue
                const stock = await Stock.findOne({});
                stock[donor.bloodType]--;
                await stock.save();

                // Envia uma resposta de sucesso
                response.send(`Última doação removida para o doador com ID ${id}!`);
            } else {
                // Envia uma resposta informando que o doador não tem histórico de doações
                response.send(`O doador com ID ${id} não tem histórico de doações.`);
            }
        }
    } catch (error) {
        // Envia uma resposta de erro se algo der errado
        console.log(error.message);
        response.status(500).send('Ocorreu um erro ao remover a última doação. Por favor, tente novamente.');
    }
}

// Exporta as funções para serem usadas em outros arquivos
export { createDonor, getDonors, createDonation, updateDonor, deleteDonor, deleteLastDonation };