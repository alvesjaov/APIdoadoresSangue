import { Router } from 'express';
import { createDonor, getDonor, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donorRoutes = Router();

donorRoutes.post('/donor', verifyEmployee, createDonor); // Rota para criar um doador
donorRoutes.get('/donors/:id?', verifyEmployee, getDonor); // O id é opcional
donorRoutes.patch('/donor/:id', verifyEmployee, updateDonor); // Rota para atualizar um doador
donorRoutes.delete('/donor/:id', verifyEmployee, deleteDonor); // Rota para deletar um doador

export default donorRoutes;