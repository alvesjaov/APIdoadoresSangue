import { verifyAdmin, verifyAdminOrEmployee } from '../../middleware/VerifyEmployees';
import passport from 'passport';

jest.mock('passport');

describe('Testando as funções de verificação de autenticação', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('verifyAdmin deve autenticar um administrador com sucesso', async () => {
    const adminEmployee = { /* dados do administrador */ };
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(null, adminEmployee);
      return jest.fn();
    });

    await verifyAdmin(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith('jwt-admin', { session: false }, expect.any(Function));
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('verifyAdmin deve retornar erro interno do servidor em caso de falha na autenticação', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(new Error('Erro de autenticação'));
      return jest.fn();
    });

    await verifyAdmin(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith('jwt-admin', { session: false }, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor. Não foi possível autenticar usando a estratégia jwt.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('verifyAdmin deve retornar acesso negado se o usuário não for um administrador', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(null, null); // Simulando que o usuário não é um administrador
      return jest.fn();
    });

    await verifyAdmin(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith('jwt-admin', { session: false }, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('verifyAdminOrEmployee deve autenticar um administrador ou funcionário com sucesso', async () => {
    const user = { /* dados do usuário */ };
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(null, user);
      return jest.fn();
    });

    await verifyAdminOrEmployee(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith(['jwt-admin', 'jwt-employee'], { session: false }, expect.any(Function));
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('verifyAdminOrEmployee deve retornar erro interno do servidor em caso de falha na autenticação', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(new Error('Erro de autenticação'));
      return jest.fn();
    });

    await verifyAdminOrEmployee(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith(['jwt-admin', 'jwt-employee'], { session: false }, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('verifyAdminOrEmployee deve retornar acesso negado se o usuário não for um administrador ou funcionário', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => {
      callback(null, null); // Simulando que o usuário não é nem um administrador nem um funcionário
      return jest.fn();
    });

    await verifyAdminOrEmployee(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith(['jwt-admin', 'jwt-employee'], { session: false }, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado.' });
    expect(next).not.toHaveBeenCalled();
  });
});
