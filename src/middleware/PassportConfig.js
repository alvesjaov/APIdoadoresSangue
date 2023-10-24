import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Employee from '../models/Employee.js'; // Importa o modelo Employee

// Função assíncrona para configurar o PassportConfig.js
async function configurePassport() {
  // Definindo as opções para a estratégia JWT
  const opts = {
    // Função para extrair o token JWT do cabeçalho de autorização
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Chave secreta para verificar a assinatura do token JWT
    secretOrKey: process.env.JWT_SECRET
  };

  // Aplicando a estratégia JWT ao PassportConfig.js
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Tentando encontrar um funcionário com o ID do payload do token JWT
      const employee = await Employee.findById(jwt_payload?.id);
      // Se o funcionário for encontrado e for um administrador, retorna o funcionário
      if (employee?.isAdmin) {
        return done(null, employee);
      } else {
        // Se o funcionário não for um administrador ou não for encontrado, retorna false
        return done(null, false);
      }
    } catch (err) {
      // Se ocorrer um erro durante a busca do funcionário, retorna o erro
      return done(err, false);
    }
  }));
}

export default configurePassport;