// Importando rotas
import { Router } from 'express';
import loginRoutes from '../routes/loginRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import donorRoutes from '../routes/donorRoutes.js';
import donationRoutes from '../routes/donationRoutes.js';
import stockRoutes from '../routes/stockRoutes.js';

const routes = Router();
routes.use(loginRoutes);
routes.use(employeeRoutes);
routes.use(donorRoutes);
routes.use(donationRoutes);
routes.use(stockRoutes);

export default routes; // Exportando rotas
