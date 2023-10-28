// Importando rotas
import { Router } from 'express';
import loginRoutes from '../routes/loginRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import donorRoutes from '../routes/donorRoutes.js';
import donationRoutes from '../routes/donationRoutes.js';
import stockRoutes from '../routes/stockRoutes.js';

const routes = Router();
routes.use('/login', loginRoutes);
routes.use('/employee', employeeRoutes);
routes.use('/donor', donorRoutes);
routes.use('/donation', donationRoutes);
routes.use('/stock', stockRoutes);

export default routes; // Exportando rotas
