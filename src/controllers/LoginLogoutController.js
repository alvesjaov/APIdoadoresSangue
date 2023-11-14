import Employee from '../models/Employee.js'; // Importa o modelo de funcionário
import bcrypt from 'bcrypt';// Importa a biblioteca bcryptjs para criptografar senhas
import jwt from 'jsonwebtoken'; // Importa a biblioteca jsonwebtoken para geração de tokens JWT
import { addToBlacklist } from '../middleware/BlacklistToken.js'; // Importa a função para adicionar um token à lista negra

// Rota para login de um funcionário
async function loginEmployee(request, response) {
  const { employeeCode, password } = request.body; // Obtém o código do funcionário e a senha do corpo da requisição

  try {
    // Procura por um funcionário existente com o mesmo código de funcionário
    const existingEmployee = await Employee.findOne({ employeeCode: employeeCode });

    // Se o funcionário não existir, retorna um erro
    if (!existingEmployee) {
      return response.status(400).json({ error: 'O código fornecido não pertence a nenhum funcionário.' });
    }

    // Verifica se a senha fornecida corresponde à senha do funcionário existente
    const isPasswordValid = await bcrypt.compare(password, existingEmployee.password);

    // Se a senha não for válida, retorna um erro
    if (!isPasswordValid) {
      return response.status(400).json({ error: 'Senha inválida.' });
    }

    // Se o código do funcionário e a senha estiverem corretos, gera um token JWT
    const token = jwt.sign({
      id: existingEmployee._id, isAdmin: existingEmployee.isAdmin
    },
      process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  
    // Filtra os tokens do funcionário para remover os tokens expirados
    let oldTokens = existingEmployee.tokens || [];

    // Se houver tokens expirados, remove-os
    if (oldTokens.length) {
      oldTokens = oldTokens.filter((t) => { // Filtra os tokens do funcionário para remover os tokens expirados
        // Calcula a diferença de tempo entre o momento atual e o momento em que o token foi assinado
        const timeDiff = Date.now - parseInt(t.signedAt) / 1000
        if (timeDiff < 3600) {
          return t
        }
      })
    }

    // Atualiza o documento do funcionário com o novo token
    await Employee.findByIdAndUpdate(existingEmployee._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    })

    // Retorna uma mensagem de sucesso e o token JWT
    response.status(200).json({ Funcionário: employeeCode, message: 'Login realizado com sucesso!', token });

  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    response.status(500).json({ error: `Ocorreu um erro ao realizar o login. Por favor, tente novamente. Erro: ${error.message}` });
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
      return response.status(200).json({ message: 'Logout realizado com sucesso!' });
    }
    // Se o cabeçalho de autorização não estiver presente, retorna um erro
    response.status(401).json({ error: 'Cabeçalho de autorização não encontrado.' });
  } catch (error) {
    // Se ocorrer um erro, retorna uma mensagem de erro
    console.error(error);
    return response.status(500).json({ error: 'Ocorreu um erro interno do servidor.' });
  }
}

// Exporta as funções de login e logout
export { loginEmployee, logoutEmployee };
