import { Router } from 'express';
import { createDonor, getDonor, updateDonor, deleteDonor } from '../../controllers/DonorController.js';
import { verifyAdminOrEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const donorRoutes = Router();

donorRoutes.post('/donors/', verifyAdminOrEmployee, checkBlacklistedToken, createDonor); // Rota para criar um doador
donorRoutes.get('/donors/:id?', verifyAdminOrEmployee, checkBlacklistedToken, getDonor); // O id é opcional
donorRoutes.get('/donors/:name?', verifyAdminOrEmployee, checkBlacklistedToken, getDonor); // O nome é opcional
donorRoutes.patch('/donors/:id', verifyAdminOrEmployee, checkBlacklistedToken, updateDonor); // Rota para atualizar um doador
donorRoutes.delete('/donors/:id', verifyAdminOrEmployee, checkBlacklistedToken, deleteDonor); // Rota para deletar um doador

export default donorRoutes;