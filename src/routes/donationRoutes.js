import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteDonation } from '../controllers/DonationController.js';
import { verifyEmployee } from '../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../middleware/Blacklist.js';


const donationRoutes = Router();

donationRoutes.post('/donations/:id', verifyEmployee, checkBlacklistedToken, createDonation); // Rota para criar uma doação
donationRoutes.get('/donations/:id', verifyEmployee, checkBlacklistedToken, readDonation); // Rota para ler uma doação específica
donationRoutes.patch('/donations/:id', verifyEmployee, checkBlacklistedToken, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/donations/:id', verifyEmployee, checkBlacklistedToken, deleteDonation); // Rota para deletar a última doação

export default donationRoutes;
