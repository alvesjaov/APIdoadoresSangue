import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteDonation } from '../controllers/DonationController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donationRoutes = Router();

donationRoutes.post('/donations/:id', verifyEmployee, createDonation); // Rota para criar uma doação
donationRoutes.get('/donations/:id', verifyEmployee, readDonation); // Rota para ler uma doação específica
donationRoutes.patch('/donations/:id', verifyEmployee, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/donations/:id', verifyEmployee, deleteDonation); // Rota para deletar a última doação

export default donationRoutes;
