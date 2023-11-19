import Employee from '../models/Employee.js';
import jwt from 'jsonwebtoken';
import { addToBlacklist } from './Blacklist.js';

async function cleanExpiredTokens() {
  // Obtém todos os funcionários
  const cursor = Employee.find().cursor();

  // Itera sobre os funcionários
  for (let employee = await cursor.next(); employee != null; employee = await cursor.next()) {
    // Filtra os tokens válidos
    const validTokens = employee.tokens.filter((t) => {
      try {
        jwt.verify(t.token, process.env.JWT_SECRET);
        return true;
      } catch (err) {
        // Se o token estiver expirado, adiciona-o à lista negra
        addToBlacklist(t.token);
        return false;
      }
    });

    await Employee.findByIdAndUpdate(employee._id, { tokens: validTokens }); // Atualiza o documento do funcionário com os novos tokens
  }
}

// Executa a função cleanExpiredTokens a cada 1 hora
setInterval(() => { 
  cleanExpiredTokens();
}, 1000 * 60 * 60); // 1000 milissegundos * 60 segundos * 60 minutos = 1 hora

export default cleanExpiredTokens;
