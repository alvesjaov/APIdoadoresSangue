import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteLastDonation } from '../controllers/DonationController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donationRoutes = Router();

donationRoutes.post('/:id/donation', verifyEmployee, createDonation); // Rota para criar uma doação
donationRoutes.get('/donation/:id', verifyEmployee, readDonation); // Rota para ler uma doação específica
donationRoutes.post('/:id/exams', verifyEmployee, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/:id/donation', verifyEmployee, deleteLastDonation); // Rota para deletar a última doação

export default donationRoutes;
