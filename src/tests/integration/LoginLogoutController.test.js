import Employee from '../../models/Employee.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  loginEmployee,
  logoutEmployee,
} from '../../controllers/LoginLogoutController.js';

jest.mock('../../models/Employee.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('loginEmployee', () => {
    it('should login an employee and return a JWT token', async () => {
      const request = {
        body: {
          employeeCode: 'valid_code',
          password: 'valid_password',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployee = {
        _id: 'valid_id',
        name: 'John Doe',
        employeeCode: 'valid_code',
        password: await bcrypt.hash('valid_password', 10),
        isAdmin: false,
      };

      Employee.findOne = jest.fn().mockResolvedValue(mockEmployee);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('mockToken');
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue({ /* Updated employee object */ });

      await loginEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        Funcionário: {
          Nome: 'John Doe',
          Código: 'valid_code',
        },
        message: 'Login realizado com sucesso!',
        token: 'mockToken',
      });
    });

    // Add more tests for invalid credentials, errors, etc.
  });

  describe('logoutEmployee', () => {
    it('should logout an employee', async () => {
      const request = {
        headers: {
          authorization: 'Bearer valid_token',
        },
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEmployee = {
        _id: 'valid_id',
        name: 'John Doe',
        employeeCode: 'valid_code',
        tokens: [
          {
            token: 'valid_token',
            signedAt: new Date().toISOString(),
          },
        ],
      };

      jwt.verify = jest.fn().mockReturnValue({ id: 'valid_id' });
      Employee.findById = jest.fn().mockResolvedValue(mockEmployee);
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue({ /* Updated employee object */ });

      await logoutEmployee(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        Funcionário: {
          Nome: 'John Doe',
          Código: 'valid_code',
        },
        message: 'Logout realizado com sucesso!',
      });
    });

    // Add more tests for invalid tokens, errors, etc.
  });
});
