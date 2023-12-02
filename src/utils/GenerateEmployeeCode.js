import Employee from '../models/Employee.js'; // Importa o modelo Employee

// Função para gerar um código numérico aleatório para o funcionário
async function generateRandomEmployeeCode(length) {
    let result = '';
    let employee = null;

    do {
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString(); // Gera um dígito aleatório de 0 a 9
        }

        employee = await Employee.findOne({ employeeCode: Number(result) }); // Procura por um funcionário com o código gerado
    } while (employee); // Repete até que um código único seja encontrado

    return Number(result); // Converte o resultado para um número e retorna
}

export { generateRandomEmployeeCode };
