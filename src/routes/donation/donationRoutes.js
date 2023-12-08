import { Router } from 'express';
import { createDonation, readDonation, deleteDonation } from '../../controllers/DonationController.js';
import { verifyAdminOrEmployee } from '../../middleware/VerifyEmployees.js';
import { checkBlacklistedToken } from '../../middleware/Blacklist.js';

const donationRoutes = Router();

donationRoutes.post('/donations/:id', verifyAdminOrEmployee, checkBlacklistedToken, createDonation); // Rota para criar uma doação
donationRoutes.get('/donations/:id', verifyAdminOrEmployee, checkBlacklistedToken, readDonation); // Rota para ler uma doação específica
donationRoutes.delete('/donations/:id', verifyAdminOrEmployee, checkBlacklistedToken, deleteDonation); // Rota para deletar a última doação

export default donationRoutes;