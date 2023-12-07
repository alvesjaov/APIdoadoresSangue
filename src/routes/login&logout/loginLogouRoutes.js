import { Router } from 'express';
import { loginEmployee, logoutEmployee } from '../../controllers/LoginLogoutController.js';

const loginLogouRoutes = Router();

loginLogouRoutes.post('/employees/login', loginEmployee); // Rota para login do funcionário
loginLogouRoutes.post('/employees/logout', logoutEmployee); // Rota para logout do funcionário

export default loginLogouRoutes;
