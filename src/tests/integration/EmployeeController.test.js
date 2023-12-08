import bcrypt from 'bcrypt';
import Employee from '../../models/Employee.js';
import { generateRandomEmployeeCode } from '../../utils/GenerateEmployeeCode.js';
import { findEmployeeByCodeOrName } from '../../utils/FindEmployee.js';
import { createEmployee, readEmployee ,updateEmployee ,deleteEmployee} from '../../controllers/EmployeeController.js';

jest.mock('bcrypt');
jest.mock('../../utils/GenerateEmployeeCode.js');
jest.mock('../../models/Employee.js');
jest.mock('../../utils/FindEmployee.js', () => ({
  findEmployeeByCodeOrName: jest.fn(),
}));

const mockRequest = (code, name, page = 1) => ({
  params: { code },
  query: { name, page }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
describe('createEmployee', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new employee', async () => {
    const request = {
      body: {
        name: 'Test Employee',
        password: 'testpassword',
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    // Mocking bcrypt functions
    bcrypt.genSalt.mockResolvedValue('mockedSalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Mocking GenerateEmployeeCode function
    generateRandomEmployeeCode.mockReturnValue('123456');

    // Mocking Employee model methods
    Employee.findOne.mockResolvedValue(null);
    Employee.prototype.save.mockResolvedValue();

    await createEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      Funcionário: {
        Nome: 'Test Employee',
        Código: '123456',
        Senha: 'testpassword',
      },
      message: 'Funcionário registrado com sucesso!',
    });
  });

  it('should handle existing employee with same name', async () => {
    const request = {
      body: {
        name: 'Existing Employee',
        password: 'existingpassword',
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    Employee.findOne.mockResolvedValue({ name: 'Existing Employee' });

    await createEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Já existe um funcionário com o mesmo nome.',
    });
  });

  it('should return an error if the password is less than 8 characters', async () => {
    const request = {
      body: {
        name: 'Test Employee',
        password: 'short', // Senha com menos de 8 caracteres
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    await createEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  });

  // it('should return an error message when there is an error while saving employee', async () => {
  //   const request = {
  //     body: {
  //       name: 'gameleira',
  //       password: 'password123', // Senha com pelo menos 8 caracteres
  //     },
  //   };
  //   const response = {
  //     status: jest.fn(() => response),
  //     json: jest.fn(),
  //   };

  //   // Mock para simular um erro ao salvar o novo funcionário
  //   jest.spyOn(Employee.prototype, 'save').mockRejectedValue(new Error('Erro ao salvar funcionário'));

  //   await createEmployee(request, response);

  //   expect(response.status).toHaveBeenCalledWith(500); // Verifica se o status é 500
  //   expect(response.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao registrar o funcionário, tente novamente.' }); // Verifica se a mensagem de erro está correta
  // });
});

describe('readEmployee', () => {
  test('Retorna funcionários encontrados com código ou nome', async () => {
    const mockRequestData = mockRequest('ABC123', null);
    const mockEmployees = [{ name: 'Employee 1' }, { name: 'Employee 2' }];
    const mockResponseData = mockResponse();

    findEmployeeByCodeOrName.mockResolvedValue(mockEmployees);

    await readEmployee(mockRequestData, mockResponseData);

    expect(mockResponseData.status).toHaveBeenCalledWith(200);
    expect(mockResponseData.json).toHaveBeenCalledWith(mockEmployees);
  });

  test('Retorna nenhum funcionário encontrado', async () => {
    const mockRequestData = mockRequest('InvalidCode', null);
    const mockResponseData = mockResponse();

    findEmployeeByCodeOrName.mockResolvedValue([]);

    await readEmployee(mockRequestData, mockResponseData);

    expect(mockResponseData.status).toHaveBeenCalledWith(404);
    expect(mockResponseData.json).toHaveBeenCalledWith({ page: 1, error: "Nenhum funcionário encontrado" });
  });

  test('Retorna erro ao buscar funcionários', async () => {
    const mockRequestData = mockRequest(null, 'John Doe');
    const mockResponseData = mockResponse();

    findEmployeeByCodeOrName.mockRejectedValue(new Error('Erro ao buscar funcionários'));

    await readEmployee(mockRequestData, mockResponseData);

    expect(mockResponseData.status).toHaveBeenCalledWith(500);
    expect(mockResponseData.json).toHaveBeenCalledWith({ error: "Ocorreu um erro ao buscar funcionários, tente novamente." });
  });
});

describe('updateEmployee', () => {
  it('should update employee data successfully', async () => {
    const request = {
      params: { code: 'employeeCode123' },
      body: {
        name: 'NewEmployeeName',
        password: 'NewValidPasswor',
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOneAndUpdate').mockResolvedValue({});

    await updateEmployee(request, response);

    expect(Employee.findOneAndUpdate).toHaveBeenCalledWith(
      { employeeCode: 'employeeCode123' },
      { name: 'NewEmployeeName', password: 'hashedPassword' },
      { new: true }
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Dados do funcionário atualizados com sucesso!' });
  });

  it('should return error when employee is not found', async () => {
    const request = {
      params: { code: 'nonExistingEmployeeCode' },
      body: {
        name: 'NewEmployeeName',
        password: 'NewValidPassword',
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOneAndUpdate').mockResolvedValue(null);

    await updateEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: 'Funcionário não encontrado.' });
  });

  it('should return error when invalid password is provided', async () => {
    const request = {
      params: { code: 'employeeCode123' },
      body: {
        name: 'NewEmployeeName',
        password: 'Short', // Senha inválida com menos de 8 caracteres
      },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    await updateEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  });

});

describe('deleteEmployee', () => {
  it('should delete an employee successfully', async () => {
    const request = {
      params: { code: 'employeeCode123' },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOne').mockResolvedValue({ isAdmin: false });
    jest.spyOn(Employee, 'findOneAndRemove').mockResolvedValue({});

    await deleteEmployee(request, response);

    expect(Employee.findOne).toHaveBeenCalledWith({ employeeCode: 'employeeCode123' });
    expect(Employee.findOneAndRemove).toHaveBeenCalledWith({ employeeCode: 'employeeCode123' });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Funcionário deletado com sucesso!' });
  });

  it('should return error when employee is not found', async () => {
    const request = {
      params: { code: 'nonExistingEmployeeCode' },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOne').mockResolvedValue(null);

    await deleteEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: 'Funcionário não encontrado.' });
  });

  it('should return error when trying to delete an admin employee', async () => {
    const request = {
      params: { code: 'adminEmployeeCode' },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOne').mockResolvedValue({ isAdmin: true });

    await deleteEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ error: 'Não é possível deletar um administrador.' });
  });

  it('should return error when an error occurs during deletion', async () => {
    const request = {
      params: { code: 'employeeCode123' },
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    jest.spyOn(Employee, 'findOne').mockRejectedValue(new Error('Database error'));
    jest.spyOn(console, 'log').mockImplementation(() => {}); // To avoid logging during test

    await deleteEmployee(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao deletar o funcionário, tente novamente.' });
  });
});
