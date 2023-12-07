import { Router } from 'express';
import  { addBloodTest, readDonationsWithEmptyBloodTest } from '../../controllers/ExamController.js';
import { verifyAdmin, verifyEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const examRoutes = Router();

examRoutes.patch('/donations/:id/exam', verifyAdmin, verifyEmployee, checkBlacklistedToken, addBloodTest); // Rota para adicionar exames de sangue
examRoutes.get('/donations/exam', verifyAdmin, verifyEmployee, checkBlacklistedToken, readDonationsWithEmptyBloodTest); //rota para retornar todas doações

export default examRoutes;