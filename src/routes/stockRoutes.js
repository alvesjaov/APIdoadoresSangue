import { Router } from 'express';
import countAndUpdateBloodTypes from '../controllers/BloodStockController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const stockRoutes = Router();

stockRoutes.get('/stock', verifyEmployee, countAndUpdateBloodTypes); // Rota para atualizar o estoque de sangue

export default stockRoutes;