import { Router } from 'express';
import  { addBloodTest, readDonationsWithEmptyBloodTest } from '../../controllers/ExamController.js';
import { verifyAdminOrEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const examRoutes = Router();

examRoutes.post('/exams/:id', verifyAdminOrEmployee, checkBlacklistedToken, addBloodTest); // Rota para adicionar exames de sangue
examRoutes.get('/exams', verifyAdminOrEmployee, checkBlacklistedToken, readDonationsWithEmptyBloodTest); //rota para retornar todas doações

export default examRoutes;