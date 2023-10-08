import Donor from '../models/Donor.js';
import Stock from '../models/Stock.js';
import { cpf } from 'cpf-cnpj-validator'; // Importando a função de validação de CPF

// Rota para cadastrar doador (CREATE)
async function createDonor(request, response) {
    // Pega os dados do doador do corpo da requisição
    const donor = request.body;
    // Se donationHistory não existir, inicializa como um array vazio
    donor.donationHistory = donor.donationHistory || [];
    // Adiciona a data atual ao histórico de doações
    donor.donationHistory.push({ donationDate: new Date().toISOString().slice(0, 10) });
    const newDonor = new Donor(donor); // Cria um novo doador com os dados fornecidos
  
    try {
        //  Verifica se o CPF é válido
        if (!cpf.isValid(donor.CPF)) {
            return response.status(400).json({ message: 'O CPF fornecido não é válido.' });
        }
        // Procura por um doador existente com o mesmo CPF
        const existingDonor = await Donor.findOne({ CPF: donor.CPF });
        if (existingDonor) {
            return response.status(400).json({ message: 'Um doador com os mesmos dados já existe.' });
        }
        // Salva o novo doador no banco de dados
        await newDonor.save();    

        response.status(201).json({ message: 'Doador cadastrado com sucesso!' });
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao cadastrar o doador. Por favor, tente novamente.Erro: ${error.message}` });
    }
}

// Rota para obter doadores (READ)
async function getDonors(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição

    try {
        let donor;
        if (id) {
            // Se um id foi fornecido, procura pelo doador correspondente
            donor = await Donor.findById(id);
        } else {
            // Retorna todos os doadores se nenhum id for fornecido
            let donors = await Donor.find({});
            if (donors.length === 0) {
                return response.status(404).json({ message: 'Nenhum doador encontrado' });
            }
            return response.status(200).json(donors); // Retorna todos os doadores encontrados
        }

        if (!donor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            response.status(200).json(donor); // Retorna o doador correspondente ao id fornecido
        }
    } catch (error) {
        console.log(error.message)
        response.status(500).json({ message: `Ocorreu um erro ao buscar doadores. Por favor, tente novamente.Erro: ${error.message}` });
    }
}

// Rota para atualizar um doador (UPDATE)
async function updateDonor(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Atualiza o doador correspondente ao id fornecido com os novos dados fornecidos no corpo da requisição
        const updatedDonor = await Donor.findByIdAndUpdate(id, request.body, { new: true });
        if (!updatedDonor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            response.json({ message: `Doador com ID ${id} atualizado com sucesso!` }); // Retorna sucesso se o doador for atualizado corretamente
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao atualizar o doador. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

// Rota para deletar um doador (DELETE)
async function deleteDonor(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Remove o doador correspondente ao id fornecido
        const removedDonor = await Donor.findByIdAndRemove(id);
        if (!removedDonor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            
            response.json({ message: `Doador com ID ${id} removido com sucesso!` }); // Retorna sucesso se o doador for removido corretamente
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao remover o doador. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

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

// Rota para deletar a última doação de um doador
async function deleteLastDonation(request, response) {
    const { id } = request.params; // Pega o id dos parâmetros da requisição
    try {
        // Procura pelo doador correspondente ao id fornecido
        const donor = await Donor.findById(id);
        if (!donor) {
            response.status(404).json({ message: `ID ${id} não corresponde a nenhum doador` });
        } else {
            if (donor.donationHistory.length > 0) {
                donor.donationHistory.pop(); // Remove a última doação do histórico de doações do doador
                await donor.save(); // Salva o doador atualizado no banco de dados

                const stock = await Stock.findOne({}); // Procura pelo estoque de sangue
                stock[donor.bloodType]--; // Decrementa a quantidade de sangue do tipo sanguíneo do doador no estoque
                await stock.save(); // Salva o estoque atualizado no banco de dados


                response.json({ message: `Última doação removida para o doador com ID ${id}!` }); // Retorna sucesso se a última doação for removida corretamente
            } else {
                response.json({ message: `O doador com ID ${id} não tem histórico de doações.` }); // Retorna uma mensagem se o doador não tiver histórico de doações
            }
        }
    } catch (error) {
        response.status(500).json({ message: `Ocorreu um erro ao remover a última doação do doador com ID ${id}. Por favor, tente novamente. Erro: ${error.message}` });
    }
}

export { createDonor, getDonors, updateDonor, deleteDonor, createDonation, deleteLastDonation }; // Exporta as funções para serem usadas em outros arquivos