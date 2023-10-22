import { Router } from 'express';
import { createDonor, getDonors, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { createDonation,readDonation, addBloodExams, deleteLastDonation } from '../controllers/DonationController.js';
import countAndUpdateBloodTypes from '../controllers/BloodStockController.js';
import { createEmployee, readEmployee, updateEmployeePassword, deleteEmployee, loginEmployee } from '../controllers/EmployeeController.js'; // Importe a função loginEmployee
import verifyAdmin from '../middleware/VerifyAdmin.js';

const routes = Router();

routes.post('/donors', createDonor); // Rota para criar um doador
routes.get('/donors/:id?', getDonors); // O id é opcional
routes.patch('/donors/:id', updateDonor); // Rota para atualizar um doador
routes.delete('/donors/:id', deleteDonor); // Rota para deletar um doador

routes.post('/donors/:id/donation', createDonation); // Rota para criar uma doação
routes.get('/donors/donation/:id', readDonation); // Rota para ler uma doação específica
routes.post('/donors/:id/exams', addBloodExams); // Rota para adicionar exames de sangue
routes.delete('/donors/:id/donation', deleteLastDonation); // Rota para deletar a última doação

routes.get('/stock', countAndUpdateBloodTypes); // Rota para atualizar o estoque de sangue

routes.post('/employees', verifyAdmin, createEmployee); // Rota para criar um funcionário
routes.get('/employees/:code?', verifyAdmin, readEmployee); // Rota para ler funcionários. O código do funcionário é opcional
routes.patch('/employees/:code/password', verifyAdmin, updateEmployeePassword); // Rota para alterar a senha de um funcionário
routes.delete('/employees/:code', verifyAdmin, deleteEmployee); // Rota para deletar um funcionário
routes.post('/login', loginEmployee); // Rota para login de um funcionário

export default routes;