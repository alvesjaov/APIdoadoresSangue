import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteDonation, readAllDonations } from '../controllers/DonationController.js';
import { verifyAdmin, verifyEmployee } from '../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../middleware/Blacklist.js';


const donationRoutes = Router();

donationRoutes.post('/donations/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, createDonation); // Rota para criar uma doação
donationRoutes.get('/donations', verifyAdmin, verifyEmployee, checkBlacklistedToken, readAllDonations); //rota para retornar todas doações
donationRoutes.get('/donations/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, readDonation); // Rota para ler uma doação específica
donationRoutes.patch('/donations/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/donations/:id', verifyAdmin, verifyEmployee, checkBlacklistedToken, deleteDonation); // Rota para deletar a última doação

export default donationRoutes;
