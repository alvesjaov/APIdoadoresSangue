import Employee from '../../models/Employee.js';
import bcrypt from 'bcrypt';
import {
  createEmployee,
  readEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../controllers/EmployeeController.js';

jest.mock('../../models/Employee.js');
jest.mock('bcrypt');

describe('Employee Controller', () => {
  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const request = {
        body: {
            password:'234567890',
            name:'Diogo'
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

      Employee.findOne = jest.fn().mockResolvedValue(null);
      Employee.prototype.save = jest.fn();

      await createEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        Funcionário: {
          Nome: expect.any(String),
          Código: expect.any(Number),
          Senha: expect.any(String),
        },
        message: 'Funcionário registrado com sucesso!',
      });
    });

    it('should return an error if the password is less than 8 characters', async () => {
      const request = {
        body: {
          // Simulate invalid password length
          password: 'short',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    });

  });

  describe('readEmployee', () => {
    it('should get an employee by employeeCode', async () => {
      const request = {
        params: {
          code: 'valid_code',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Employee.findOne = jest.fn().mockResolvedValue({ /* Simulated employee object */ });

      await readEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ /* Simulated employee object */ });
    });

    // Add more tests for scenarios like fetching all employees, employee not found, etc.
  });

  describe('updateEmployee', () => {
    it('should update an employee password by employeeCode', async () => {
      const request = {
        params: {
          code: 'valid_code',
        },
        body: {
          password: 'newPassword123',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

      Employee.findOneAndUpdate = jest.fn().mockResolvedValue({ /* Updated employee object */ });

      await updateEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Senha alterada com sucesso!' });
    });

    // Add more tests for scenarios like employee not found, invalid password, etc.
  });

  describe('deleteEmployee', () => {
    it('should delete an employee by employeeCode', async () => {
      const request = {
        params: {
          code: 'valid_code',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Employee.findOne = jest.fn().mockResolvedValue({ isAdmin: false });
      Employee.findOneAndRemove = jest.fn().mockResolvedValue({ /* Removed employee object */ });

      await deleteEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Funcionário deletado com sucesso!' });
    });
  });
});
