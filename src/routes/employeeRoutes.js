import { Router } from 'express';
import { createEmployee, readEmployee, updateEmployeePassword, deleteEmployee } from '../controllers/EmployeeController.js';
import { verifyAdmin } from '../middleware/Verify.js';

const employeeRoutes = Router();

employeeRoutes.post('/employee', verifyAdmin, createEmployee); // Rota para criar um funcionário
employeeRoutes.get('/employees/:code?', verifyAdmin, readEmployee); // Rota para ler funcionários. O código do funcionário é opcional
employeeRoutes.patch('/employee/:code/password', verifyAdmin, updateEmployeePassword); // Rota para alterar a senha de um funcionário
employeeRoutes.delete('/employee/:code', verifyAdmin, deleteEmployee); // Rota para deletar um funcionário

export default employeeRoutes;