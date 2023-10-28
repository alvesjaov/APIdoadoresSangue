// Importando rotas
import { Router } from 'express';
import loginRoutes from '../routes/loginRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import donorRoutes from '../routes/donorRoutes.js';
import donationRoutes from '../routes/donationRoutes.js';
import stockRoutes from '../routes/stockRoutes.js';

const routes = (app) => {
    app.use('/login', loginRoutes);
    app.use('/employee', employeeRoutes);
    app.use('/donor', donorRoutes);
    app.use('/donation', donationRoutes);
    app.use('/stock', stockRoutes);
};

export default routes; // Exportando rotas
