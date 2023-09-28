import Donor from '../models/Donor.js';
import moment from 'moment-timezone';

// Rota para cadastrar doador (CREATE)
async function createDonor(request, response) {
    const newDonor = new Donor(request.body);
    try {
        await newDonor.save();
        response.status(201).send('Doador cadastrado com sucesso!');
    } catch (error) {
        response.status(500).send('Ocorreu um erro ao cadastrar o doador. Por favor, tente novamente.');
    }
}

// Rota para obter doadores (READ)
async function getDonors(request, response) {
    const { name } = request.params;

    try {
        let donors;
        if (name) {
            donors = await Donor.find({ Name: name }); // Pesquisa por name, se fornecido
        } else {
            donors = await Donor.find(); // Retorna todos os doadores se nenhum name for fornecido
        }

        if (donors.length === 0) {
            response.status(404).json('Nenhum doador encontrado');
        } else {
            response.status(200).json(donors);
        }
    } catch (error) {
        response.status(500).send('Ocorreu um erro ao buscar doadores. Por favor, tente novamente.');
    }
}

// Rota para criar uma doação (CREATE)
async function createDonation(request, response) {
    const { id } = request.params;
    try {
        const donor = await Donor.findById(id); // Find the donor by ID
        if (!donor) {
            response.status(404).json('Doador não encontrado');
        } else {
            // Adiciona a data atual ao histórico de doações
            donor.donationHistory.push(moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss'));
            await donor.save();
            response.send(`Nova doação registrada para o doador com ID ${id}!`); // Use the donor's ID in the response message
        }
    } catch (error) {
        response.status(500).send('Ocorreu um erro ao registrar a doação. Por favor, tente novamente.');
    }
}


// Rota para atualizar um doador (UPDATE)
async function updateDonor(request, response) {
    const { id } = request.params;
    try {
        const updatedDonor = await Donor.findByIdAndUpdate(id, request.body, { new: true });
        if (!updatedDonor) {
            response.status(404).json('Doador não encontrado');
        } else {
            response.send(`Doador com ID ${id} atualizado com sucesso!`);
        }
    } catch (error) {
        response.status(500).send('Ocorreu um erro ao atualizar o doador. Por favor, tente novamente.');
    }
}

// Rota para deletar um doador (DELETE)
async function deleteDonor(request, response) {
    const { id } = request.params;
    try {
        const removedDonor = await Donor.findByIdAndRemove(id);
        if (!removedDonor) {
            response.status(404).json('Doador não encontrado');
        } else {
            response.send(`Doador com ID ${id} removido com sucesso!`);
        }
    } catch (error) {
        response.status(500).send('Ocorreu um erro ao remover o doador. Por favor, tente novamente.');
    }
}

export { getDonors, createDonor, createDonation, updateDonor, deleteDonor };