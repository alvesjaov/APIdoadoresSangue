import Employee from '../models/Employee.js'; // Importa o modelo Employee
import { findEmployeeByCodeOrName } from '../utils/FindEmployee.js'; // Importa a função auxiliar para buscar funcionário por código ou nome
import { generateRandomEmployeeCode } from '../utils/GenerateEmployeeCode.js'; // Importa a função auxiliar para gerar um código numérico aleatório para o funcionário
import bcrypt from 'bcrypt'; // Importa a biblioteca bcrypt para criptografia de senhas

// Rota para registrar um funcionário (CREATE)
async function createEmployee(request, response) {
  const employee = request.body; // Obtém os dados do funcionário do corpo da requisição
  const passwordUnlocked = employee.password; // Obtém a senha do funcionário

  // Verifica se a senha tem pelo menos 8 caracteres
  if (employee.password.length < 8) {
    return response.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  // Gera automaticamente o employeeCode antes de salvar o funcionário
  employee.employeeCode = await generateRandomEmployeeCode(6);
  
  // Criptografa a senha antes de salvá-la no banco de dados
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);

  const newEmployee = new Employee(employee); // Cria um novo funcionário com os dados fornecidos

  try {
    // Procura por um funcionário existente com o mesmo nome
    const existingEmployee = await Employee.findOne({ name: newEmployee.name });

    if (existingEmployee) {
      return response.status(400).json({ error: 'Já existe um funcionário com o mesmo nome.' });
    }

    // Salva o novo funcionário no banco de dados
    await newEmployee.save();

    response.status(201).json({ Funcionário: { Nome: employee.name, Código: employee.employeeCode, Senha: passwordUnlocked }, message: 'Funcionário registrado com sucesso!' });

  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.log(error.message);
    response.status(500).json({ error: "Ocorreu um erro ao registrar o funcionário, tente novamente." });
  }
}

// Rota para ler funcionários (READ)
async function readEmployee(request, response) {
  const employeeCode = request.params.code;
  const employeeName = request.query.name;

  try {
    let employeeOrName = employeeCode || employeeName;
    let employees;

    if (employeeOrName) {
      // Se um código de funcionário ou nome foi fornecido, procura por esse funcionário
      employees = await findEmployeeByCodeOrName(employeeOrName);
    } else {
      // Se nenhum código de funcionário ou nome foi fornecido, retorna todos os funcionários
      employees = await Employee.find();
    }

    if (!employees || employees.length === 0) {
      return response.status(404).json({ error: 'Funcionário não encontrado.' });
    }

    return response.status(200).json(employees);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: "Ocorreu um erro ao buscar funcionários, tente novamente." });
  }
}

// Rota para alterar o nome ou a senha do funcionário (PATCH)
async function updateEmployee(request, response) {
  try {
    const employeeCode = request.params.code; // Obtém o código do funcionário da URL
    const newName = request.body.name; // Obtém o novo nome do corpo da requisição
    const newPassword = request.body.password; // Obtém a nova senha do corpo da requisição

    // Verifica se a nova senha tem pelo menos 8 caracteres
    if (newPassword && newPassword.length < 8) {
      return response.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    // Criptografa a nova senha antes de salvá-la no banco de dados
    let hashedPassword = null;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    // Procura pelo funcionário com o código fornecido e atualiza seu nome e/ou senha
    const updateEmployee = await Employee.findOneAndUpdate(
      { employeeCode: employeeCode },
      { ...(newName && { name: newName }), ...(hashedPassword && { password: hashedPassword }) },
      { new: true }
    );

    // Se não encontrar o funcionário, retorna um erro
    if (!updateEmployee) {
      return response.status(404).json({ error: 'Funcionário não encontrado.' });
    }

    // Se encontrar o funcionário, retorna uma mensagem de sucesso
    return response.status(200).json({ message: 'Dados do funcionário atualizados com sucesso!' });
  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.log(error.message);
    response.status(500).json({ error: "Ocorreu um erro ao alterar os dados do funcionário, tente novamente." });
  }
}

// Rota para deletar funcionário (DELETE)
async function deleteEmployee(request, response) {
  try {
    const employeeCode = request.params.code; // Obtém o código do funcionário da URL

    const employee = await Employee.findOne({ employeeCode: employeeCode }); // Procura pelo funcionário com o código fornecido

    if (!employee) {
      return response.status(404).json({ error: 'Funcionário não encontrado.' });
    }

    if (employee.isAdmin) { // Verifica se o funcionário é um administrador
      return response.status(403).json({ error: 'Não é possível deletar um administrador.' });
    }

    await Employee.findOneAndRemove({ employeeCode: employeeCode }); // Remove o funcionário

    return response.status(200).json({ message: 'Funcionário deletado com sucesso!' });
  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.log(error.message);
    response.status(500).json({ error: "Ocorreu um erro ao deletar o funcionário, tente novamente." });
  }
}

export { createEmployee, readEmployee, updateEmployee, deleteEmployee };