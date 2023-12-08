import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Employee from '../models/Employee.js';

// Função assíncrona para configurar o passport
async function configurePassport() {
  // Opções para a estratégia JWT
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o JWT do cabeçalho da requisição
    secretOrKey: process.env.JWT_SECRET // Chave secreta para decodificar o JWT
  };

  // Configurando a estratégia 'jwt' do passport
  passport.use('jwt-admin', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Procura um funcionário com o ID presente no payload do JWT
      const employee = await Employee.findById(jwt_payload?.id);
      // Se o funcionário for um administrador, retorna o funcionário
      if (employee?.isAdmin===true) {
        return done(null, employee);
      } else {
        // Se o funcionário não for um administrador, retorna false
        return done(null, false);
      }
    } catch (err) {
      // Se houver um erro, retorna o erro
      return done(err);
    }    
  }));

  // Configurando a estratégia 'jwt-employee' do passport
  passport.use('jwt-employee', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Procura um funcionário com o ID presente no payload do JWT
      const employee = await Employee.findById(jwt_payload?.id);
      // Se o funcionário existir, retorna o funcionário
      if (employee) {
        return done(null, employee);
      } else {
        // Se o funcionário não existir, retorna false
        return done(null, false);
      }
    } catch (err) {
      // Se houver um erro, retorna o erro
      return done(err);
    }    
  }));

}

// Exporta a função configurePassport para ser usada em outros módulos
export default configurePassport;