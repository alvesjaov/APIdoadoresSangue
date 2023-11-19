import { Router } from 'express';
import countAndUpdateBloodTypes from '../controllers/BloodStockController.js';
import { verifyEmployee } from '../middleware/verify.js';
import { checkBlacklistedToken } from '../middleware/manageBlacklist.js';

const stockRoutes = Router();

stockRoutes.get('/stock', verifyEmployee,checkBlacklistedToken, countAndUpdateBloodTypes); // Rota para atualizar o estoque de sangue

export default stockRoutes;