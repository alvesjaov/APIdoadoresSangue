import loginRoutes from './loginRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import donorRoutes from './donorRoutes.js';
import donationRoutes from './donationRoutes.js';
import stockRoutes from './stockRoutes.js';
import { Router } from 'express';

const routes = Router();
routes.use('/login', loginRoutes);
routes.use('/employee', employeeRoutes);
routes.use('/donor', donorRoutes);
routes.use('/donation', donationRoutes);
routes.use('/stock', stockRoutes);

export default routes;