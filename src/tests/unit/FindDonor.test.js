// Importe as funções que você deseja testar
import { verifyAdmin, verifyEmployee } from '../../middleware/VerifyEmployees';
import { addToBlacklist, checkBlacklistedToken } from '../../middleware/TokenBlacklist';

// Mock para simular passport
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
    if (strategy === 'jwt') {
      // Simulando o comportamento para a estratégia 'jwt'
      callback(null, { isAdmin: true }); // Modifique para simular diferentes cenários
    } else if (strategy === 'jwt-employee') {
      // Simulando o comportamento para a estratégia 'jwt-employee'
      callback(null, { isEmployee: true }); // Modifique para simular diferentes cenários
    }
  }),
}));

describe('Authentication Middleware', () => {
  describe('verifyAdmin', () => {
    it('should allow access for admin', async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const next = jest.fn();

      await verifyAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    // Adicione mais testes para cenários diferentes, como erro de autenticação, usuário não administrador, etc.
  });

  describe('verifyEmployee', () => {
    it('should allow access for employee', async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const next = jest.fn();

      await verifyEmployee(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});




// Mock para simular a lista negra de tokens
let blacklistedTokensMock = [];

// Substitui a implementação original pela mock
addToBlacklist = (token) => {
  blacklistedTokensMock.push(token);
};

isTokenBlacklisted = (token) => {
  return blacklistedTokensMock.includes(token);
};

describe('Token Blacklist Middleware', () => {
  beforeEach(() => {
    // Limpa a lista negra antes de cada teste
    blacklistedTokensMock = [];
  });

  it('should block access for blacklisted token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer blacklistedToken'
      }
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Adiciona um token à lista negra para teste
    addToBlacklist('blacklistedToken');

    await checkBlacklistedToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow access for non-blacklisted token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer validToken'
      }
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    await checkBlacklistedToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});

