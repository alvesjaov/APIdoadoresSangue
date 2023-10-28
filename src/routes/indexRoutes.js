import loginRoutes from './loginRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import donorRoutes from './donorRoutes.js';
import donationRoutes from './donationRoutes.js';
import stockRoutes from './stockRoutes.js';

const routes = (app) => {  
    app.use('/login', loginRoutes);
    app.use('/employee', employeeRoutes);
    app.use('/donor', donorRoutes);
    app.use('/donation', donationRoutes);
    app.use('/stock', stockRoutes);
    }
export default routes;