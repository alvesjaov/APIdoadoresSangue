import Employee from '../models/Employee.js'; // Importa o modelo Employee
import bcrypt from 'bcrypt'; // Importa a biblioteca bcrypt para criptografia de senhas

// Middleware de autenticação
async function verifyAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization; // Obtém o cabeçalho de autorização da requisição

        // Se não houver cabeçalho de autorização, retorna um erro
        if (!authHeader) {
            return res.status(401).json({ message: 'Acesso negado. Nenhum token de autenticação fornecido.' });
        }

        const authParts = authHeader.split(' '); // Divide o cabeçalho de autorização em partes

        // Se o cabeçalho de autorização não estiver bem formado, retorna um erro
        if (authParts.length !== 2 || authParts[0] !== 'Basic') {
            return res.status(401).json({ message: 'Acesso negado. Token de autenticação malformado.' });
        }

        const decodedAuth = Buffer.from(authParts[1], 'base64').toString('utf8'); // Decodifica a parte codificada do cabeçalho de autorização
        const [employeeCode, password] = decodedAuth.split(':'); // Divide a string decodificada em código do funcionário e senha

        const employee = await Employee.findOne({ employeeCode: employeeCode }); // Procura um funcionário com o código fornecido

        // Se não encontrar um funcionário, retorna um erro
        if (!employee) {
            return res.status(401).json({ message: 'Acesso negado. Funcionário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, employee.password); // Compara a senha fornecida com a senha do funcionário
        // Se a senha não corresponder, retorna um erro
        if (!isMatch) {
            return res.status(401).json({ message: 'Acesso negado. Senha incorreta.' });
        }

        // Se o funcionário for um administrador, chama a próxima função no pipeline do Express
        if (employee.isAdmin) {
            next();
        } else { // Se o funcionário não for um administrador, retorna um erro
            res.status(403).json({ message: 'Acesso negado. Você precisa ser um administrador para acessar esta rota.' });
        }
    } catch (error) { // Se ocorrer algum erro, retorna uma mensagem de erro
        res.status(500).json({ message: `Erro ao verificar as credenciais do administrador: ${error.message}` });
    }
}

export default verifyAdmin; // Exporta a função verifyAdmin como padrão