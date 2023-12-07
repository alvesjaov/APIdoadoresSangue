// Importe as funções que você deseja testar
// import { verifyAdmin, verifyEmployee } from '../../middleware/VerifyEmployees';
import Employee from '../models/Employee.js';
import jwt from 'jsonwebtoken';
import { addToBlacklist } from './Blacklist.js';
import mongoose from 'mongoose';



//const { mockRequest, mockResponse } = require('jest-mock-req-res');


// Sua função cleanExpiredTokens
async function cleanExpiredTokens() {
  const cursor = Employee.find().cursor();
  for (let employee = await cursor.next(); employee != null; employee = await cursor.next()) {
    const validTokens = employee.tokens.filter((t) => {
      try {
        jwt.verify(t.token, process.env.JWT_SECRET);
        return true;
      } catch (err) {
        addToBlacklist(t.token);
        return false;
      }
    });
    await Employee.findByIdAndUpdate(employee._id, { tokens: validTokens });
  }
}

// Mock da função addToBlacklist
function addToBlacklist(token) {
  // Implemente a lógica para adicionar o token à lista negra
}

// Testes
describe('Teste da função cleanExpiredTokens', () => {
  it('deve remover os tokens expirados e adicioná-los à lista negra', async () => {
    // Cria um mock do modelo Employee
    const employees = [
      { _id: mongoose.Types.ObjectId(), tokens: [{ token: 'validToken' }, { token: 'expiredToken' }] },
      { _id: mongoose.Types.ObjectId(), tokens: [{ token: 'validToken' }] },
    ];
    jest.spyOn(Employee, 'find').mockReturnValue({
      cursor: function* () {
        yield* employees;
      },
    });
    jest.spyOn(Employee, 'findByIdAndUpdate');

    // Cria um mock da função jwt.verify
    jwt.verify = jest.fn().mockImplementation((token) => {
      if (token === 'expiredToken') {
        throw new Error('Token expirado');
      }
    });

    // Cria um mock da função addToBlacklist
    const addToBlacklistMock = jest.fn();
    global.addToBlacklist = addToBlacklistMock;

    await cleanExpiredTokens();

    expect(addToBlacklistMock).toHaveBeenCalledWith('expiredToken');
    expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(employees[0]._id, { tokens: [{ token: 'validToken' }] });
  });
});
