import { Router } from 'express';
import { createEmployee, readEmployee, updateEmployeePassword, deleteEmployee } from '../controllers/EmployeeController.js';
import { verifyAdmin } from '../middleware/verify.js';
import { checkBlacklistedToken } from '../middleware/manageBlacklist.js';

const employeeRoutes = Router();

employeeRoutes.post('/employees/', verifyAdmin, checkBlacklistedToken, createEmployee); // Rota para criar um funcionário
employeeRoutes.get('/employees/:code?', verifyAdmin, checkBlacklistedToken, readEmployee); // Rota para ler funcionários. O código do funcionário é opcional
employeeRoutes.patch('/employees/:code', verifyAdmin, checkBlacklistedToken, updateEmployeePassword); // Rota para alterar a senha de um funcionário
employeeRoutes.delete('/employees/:code', verifyAdmin, checkBlacklistedToken, deleteEmployee); // Rota para deletar um funcionário

export default employeeRoutes;
