import loginLogouRoutes from './login&logout/loginLogouRoutes.js';
import employeeRoutes from './employee/employeeRoutes.js';
import donorRoutes from './donor/donorRoutes.js';
import donationRoutes from './donation/donationRoutes.js';
import examRoutes from './exam/examRoutes.js';
import stockRoutes from './stock/stockRoutes.js';
import { Router } from 'express';

const routes = Router();
routes.use(loginLogouRoutes);
routes.use(employeeRoutes);
routes.use(donorRoutes);
routes.use(donationRoutes);
routes.use(examRoutes);
routes.use(stockRoutes);

export default routes;