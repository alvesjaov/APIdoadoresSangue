import { Router } from 'express';
import  { addBloodTest, readDonationsWithEmptyBloodTest } from '../../controllers/ExamController.js';
import { verifyAdmin, verifyEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const examRoutes = Router();

examRoutes.post('/exams/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, addBloodTest); // Rota para adicionar exames de sangue
examRoutes.get('/exams', verifyAdmin, verifyEmployee, checkBlacklistedToken, readDonationsWithEmptyBloodTest); //rota para retornar todas doações

export default examRoutes;