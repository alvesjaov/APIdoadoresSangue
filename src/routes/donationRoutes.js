import { Router } from 'express';
import { createDonation, readDonation, addBloodExams, deleteDonation } from '../controllers/DonationController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donationRoutes = Router();

donationRoutes.post('/new-donation/:id', verifyEmployee, createDonation); // Rota para criar uma doação
donationRoutes.get('/see-donation/:id', verifyEmployee, readDonation); // Rota para ler uma doação específica
donationRoutes.post('/add-exams/:id', verifyEmployee, addBloodExams); // Rota para adicionar exames de sangue
donationRoutes.delete('/del-donation/:id', verifyEmployee, deleteDonation); // Rota para deletar a última doação

export default donationRoutes;
