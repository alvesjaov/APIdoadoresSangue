// Importe o modelo Employee se ainda não estiver importado
import Employee from '../models/Employee.js';

async function findEmployeeByCodeOrName(codeOrName) {
    try {
        // Verifica se é um código
        const isCode = !isNaN(codeOrName);

        if (isCode) {
            // Se for um código, busca pelo código
            return await Employee.findOne({ code: codeOrName });
        } else {
            // Se for um nome, constrói uma expressão regular incremental
            const regexString = `^${codeOrName}`;
            const regex = new RegExp(regexString, 'i');
            return await Employee.find({ name: regex });
        }
    } catch (error) {
        console.log(error.message);
        throw new Error('Erro ao buscar funcionários. Tente novamente.');
    }
}

export { findEmployeeByCodeOrName };
