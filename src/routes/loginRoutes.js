import { Router } from 'express';
import { loginEmployee } from '../controllers/LoginController.js';

const employeeRoutes = Router();

employeeRoutes.post('/start-login', loginEmployee); // Rota para login do funcionário

export default employeeRoutes;