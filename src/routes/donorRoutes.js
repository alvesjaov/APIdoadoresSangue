import { Router } from 'express';
import { createDonor, getDonor, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { verifyEmployee } from '../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../middleware/Blacklist.js';

const donorRoutes = Router();

donorRoutes.post('/donors/', verifyEmployee, checkBlacklistedToken, createDonor); // Rota para criar um doador
donorRoutes.get('/donors/:id?', verifyEmployee, checkBlacklistedToken, getDonor); // O id é opcional
donorRoutes.patch('/donors/:id', verifyEmployee, checkBlacklistedToken, updateDonor); // Rota para atualizar um doador
donorRoutes.delete('/donors/:id', verifyEmployee, checkBlacklistedToken, deleteDonor); // Rota para deletar um doador

export default donorRoutes;