import { Router } from 'express';
import countAndUpdateBloodTypes from '../../controllers/BloodStockController.js';
import { verifyAdmin, verifyEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const stockRoutes = Router();

stockRoutes.get('/stock', verifyAdmin, verifyEmployee,checkBlacklistedToken, countAndUpdateBloodTypes); // Rota para atualizar o estoque de sangue

export default stockRoutes;