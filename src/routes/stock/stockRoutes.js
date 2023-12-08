import { Router } from 'express';
import countAndUpdateBloodTypes from '../../controllers/BloodStockController.js';
import { verifyAdminOrEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const stockRoutes = Router();

stockRoutes.get('/stock', verifyAdminOrEmployee, checkBlacklistedToken, countAndUpdateBloodTypes);

export default stockRoutes;