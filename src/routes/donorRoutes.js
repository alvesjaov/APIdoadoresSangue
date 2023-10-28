import { Router } from 'express';
import { createDonor, getDonors, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { verifyEmployee } from '../middleware/Verify.js';

const donorRoutes = Router();

donorRoutes.post('/', verifyEmployee, createDonor); // Rota para criar um doador
donorRoutes.get('/:id?', verifyEmployee, getDonors); // O id é opcional
donorRoutes.patch('/:id', verifyEmployee, updateDonor); // Rota para atualizar um doador
donorRoutes.delete('/:id', verifyEmployee, deleteDonor); // Rota para deletar um doador

export default donorRoutes;