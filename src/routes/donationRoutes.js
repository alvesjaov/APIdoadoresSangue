import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteLastDonation } from '../controllers/DonationController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donationRoutes = Router();

donationRoutes.post('/donors/:id/donation', verifyEmployee, createDonation); // Rota para criar uma doação
donationRoutes.get('/donors/donation/:id', verifyEmployee, readDonation); // Rota para ler uma doação específica
donationRoutes.post('/donors/:id/exams', verifyEmployee, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/donors/:id/donation', verifyEmployee, deleteLastDonation); // Rota para deletar a última doação

export default donationRoutes;
