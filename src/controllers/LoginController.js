import Employee from '../models/Employee.js'; // Importa o modelo de funcionário
import bcrypt from 'bcrypt';// Importa a biblioteca bcryptjs para criptografar senhas
import jwt from 'jsonwebtoken'; // Importa a biblioteca jsonwebtoken para geração de tokens JWT

// Rota para login de um funcionário
async function loginEmployee(request, response) {
    const { employeeCode, password } = request.body; // Obtém o código do funcionário e a senha do corpo da requisição
  
    try {
      // Procura por um funcionário existente com o mesmo código de funcionário
      const existingEmployee = await Employee.findOne({ employeeCode: employeeCode });
  
      if (!existingEmployee) {
        return response.status(400).json({ error: 'O código fornecido não pertence a nenhum funcionário.' });
      }
  
      // Verifica se a senha fornecida corresponde à senha do funcionário existente
      const isPasswordValid = await bcrypt.compare(password, existingEmployee.password);
  
      if (!isPasswordValid) {
        return response.status(400).json({ error: 'Senha inválida.' });
      }
  
      // Se o código do funcionário e a senha estiverem corretos, gera um token JWT
      const token = jwt.sign({ id: existingEmployee._id, isAdmin: existingEmployee.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Retorna uma mensagem de sucesso e o token JWT
      response.json({ message: 'Login realizado com sucesso!', token });
  
    } catch (error) {
      response.status(500).json({ error: `Ocorreu um erro ao realizar o login. Por favor, tente novamente. Erro: ${error.message}` });
    }
  }

  export { loginEmployee };