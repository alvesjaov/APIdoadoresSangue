import { Router } from 'express';
import { loginEmployee } from '../controllers/LoginController.js';

const employeeRoutes = Router();

employeeRoutes.post('/login', loginEmployee); // Rota para login de um funcionário

export default employeeRoutes;