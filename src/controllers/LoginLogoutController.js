import Employee from '../models/Employee.js'; // Importa o modelo de funcionário
import bcrypt from 'bcrypt';// Importa a biblioteca bcryptjs para criptografar senhas
import jwt from 'jsonwebtoken'; // Importa a biblioteca jsonwebtoken para geração de tokens JWT
import { addToBlacklist } from '../middleware/BlacklistToken.js'; // Importa a função para adicionar um token à lista negra

// Rota para login de um funcionário
async function loginEmployee(request, response) {
  const { employeeCode, password } = request.body; // Obtém o código do funcionário e a senha do corpo da requisição

  try {
    // Procura por um funcionário existente com o mesmo código de funcionário
    const employee = await Employee.findOne({ employeeCode: employeeCode });

    // Se o funcionário não existir, retorna um erro
    if (!employee) {
      return response.status(400).json({ error: 'O código fornecido não pertence a nenhum funcionário.' });
    }

    // Verifica se a senha fornecida corresponde à senha do funcionário existente
    const isPasswordValid = await bcrypt.compare(password, employee.password);

    // Se a senha não for válida, retorna um erro
    if (!isPasswordValid) {
      return response.status(400).json({ error: 'Senha inválida.' });
    }

    // Se o código do funcionário e a senha estiverem corretos, gera um token JWT
    const token = jwt.sign({
      id: employee._id, isAdmin: employee.isAdmin
    },
      process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Obtém os tokens antigos do funcionário
    let oldToken = employee.tokens = [];// Inicializa a variável com um array vazio 

    // Se o funcionário já tiver tokens antigos, filtra os tokens para remover os tokens expirados
    if (oldToken.length) {
      oldToken = oldToken.filter((t) => { // Filtra os tokens do funcionário para remover os tokens expirados
        try {
          jwt.verify(t.token, process.env.JWT_SECRET); // Verifica se o token é válido
          return true;
        } catch (err) {
          return null; // Se o token for inválido, retorna null
        }
      })
    }

    // Atualiza o documento do funcionário com o novo token
    await Employee.findByIdAndUpdate(employee._id, {
      tokens: [...oldToken, { token, signedAt: new Date().toISOString() }],
    })

    // Retorna uma mensagem de sucesso e o token JWT
    response.status(200).json({ Funcionário: { Nome: employee.name, Código: employee.employeeCode }, message: 'Login realizado com sucesso!', token });

  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.error(error.message);
    response.status(500).json({ error: "Ocorreu um erro ao realizar o login. Por favor, tente novamente." });
  }
}

// Rota para logout de um funcionário
async function logoutEmployee(request, response) {
  try {
    // Verifica se o cabeçalho de autorização está presente
    if (request.headers?.authorization) {
      // Extrai o token do cabeçalho de autorização
      const token = request.headers.authorization.split(' ')[1];
      // Se o token não estiver presente, retorna um erro
      if (!token) {
        return response.status(401).json({ error: 'Não autorizado.' });
      }
      // Adiciona o token à lista negra
      addToBlacklist(token);

      // Decodifica o token para obter o ID do funcionário
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        // Se o token for inválido ou expirado, retorna um erro
        return response.status(401).json({ error: 'Token inválido ou expirado.' });
      }
      const employeeId = decoded.id;

      // Encontra o funcionário no banco de dados
      const employee = await Employee.findById(employeeId);
      // Se o funcionário não existir, retorna um erro
      if (!employee) {
        return response.status(401).json({ error: 'Funcionário não encontrado.' });
      }

      // Filtra os tokens do funcionário para remover o token atual
      const newTokens = employee.tokens.filter((t) => t.token !== token);

      // Atualiza o documento do funcionário com os novos tokens
      await Employee.findByIdAndUpdate(employeeId, { tokens: newTokens });

      // Retorna uma mensagem de sucesso
      return response.status(200).json({ Funcionário: { Nome: employee.name, Código: employee.employeeCode }, message: 'Logout realizado com sucesso!' });
    }
    // Se o cabeçalho de autorização não estiver presente, retorna um erro
    response.status(401).json({ error: 'Cabeçalho de autorização não encontrado.' });
  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.error(error.message);
    return response.status(500).json({ error: 'Ocorreu um erro interno do servidor.' });
  }
}

// Exporta as funções de login e logout
export { loginEmployee, logoutEmployee };
