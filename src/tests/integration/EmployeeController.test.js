import bcrypt from 'bcrypt';
import Employee from '../../models/Employee.js';
import { generateRandomEmployeeCode } from '../../utils/GenerateEmployeeCode.js';
import { findEmployeeByCodeOrName } from '../../utils/FindEmployee.js';
import { createEmployee, readEmployee ,updateEmployee ,deleteEmployee} from '../../controllers/EmployeeController.js'; // Substitua 'your-file-name.js' com o nome do seu arquivo que contém as funções

jest.mock('bcrypt');
jest.mock('../../utils/GenerateEmployeeCode.js');
jest.mock('../../models/Employee.js');
jest.mock('../../utils/FindEmployee.js', () => ({
  findEmployeeByCodeOrName: jest.fn(),
}));
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
  it('should return employees when employee code is provided', async () => {
    const request = {
      params: {
        code: 'employeeCode123',
      },
      query: {},
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    findEmployeeByCodeOrName.mockResolvedValue([{ name: 'Employee1' }]); // Mock da função para retornar um valor específico
    await readEmployee(request, response);

    expect(findEmployeeByCodeOrName).toHaveBeenCalledWith('employeeCode123');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([{ name: 'Employee1' }]);
  });

  it('should return error when no employee is found', async () => {
    const request = {
      params: {
        code: 'nonExistingEmployeeCode',
      },
      query: {},
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    // Simulando que nenhum funcionário foi encontrado
    findEmployeeByCodeOrName.mockResolvedValue([]);

    await readEmployee(request, response);

    expect(findEmployeeByCodeOrName).toHaveBeenCalledWith('nonExistingEmployeeCode');
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: 'Funcionário não encontrado.' });
  });

  it('should return all employees when no code is provided', async () => {
    const request = {
      params: {},
      query: {}, // Simula a ausência total de código ou nome
    };
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(),
    };

    // Simulando que nenhum código ou nome de funcionário foi fornecido
    findEmployeeByCodeOrName.mockReset(); // Resetando o mock para garantir que não haja chamadas anteriores
    jest.spyOn(Employee, 'find').mockResolvedValue([{ name: 'Employee1' }, { name: 'Employee2' }]);

    await readEmployee(request, response);

    expect(findEmployeeByCodeOrName).not.toHaveBeenCalled(); // Verifica se a função não foi chamada
    expect(Employee.find).toHaveBeenCalled(); // Verifica se Employee.find foi chamada
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([{ name: 'Employee1' }, { name: 'Employee2' }]);
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
