// Importando rotas
import loginRoutes from '../routes/loginRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import donorRoutes from '../routes/donorRoutes.js';
import donationRoutes from '../routes/donationRoutes.js';
import stockRoutes from '../routes/stockRoutes.js';

const routes = (app) => {
    app.use(loginRoutes);
    app.use(employeeRoutes);
    app.use(donorRoutes);
    app.use(donationRoutes);
    app.use(stockRoutes);
}
export default routes; // Exportando rotas