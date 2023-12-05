import { Router } from 'express';
import { createDonor, getDonor, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { verifyAdmin, verifyEmployee } from '../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../middleware/Blacklist.js';

const donorRoutes = Router();

donorRoutes.post('/donors/', verifyAdmin, verifyEmployee, checkBlacklistedToken, createDonor); // Rota para criar um doador
donorRoutes.get('/donors/:id?', verifyAdmin, verifyEmployee, checkBlacklistedToken, getDonor); // O id é opcional
donorRoutes.get('/donors/:name?', verifyAdmin, verifyEmployee, checkBlacklistedToken, getDonor); // O nome é opcional
donorRoutes.patch('/donors/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, updateDonor); // Rota para atualizar um doador
donorRoutes.delete('/donors/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, deleteDonor); // Rota para deletar um doador

export default donorRoutes;