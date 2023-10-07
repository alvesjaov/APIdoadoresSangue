import { Router } from 'express';
import { createDonor, getDonors, updateDonor, deleteDonor, createDonation, deleteLastDonation } from '../controllers/DonorController.js';
import  countAndUpdateBloodTypes from '../controllers/BloodStockController.js';

const routes = Router();

routes.post('/donors', createDonor);
routes.get('/donors/:id?', getDonors); // O id é opcional
routes.patch('/donors/:id', updateDonor);
routes.delete('/donors/:id', deleteDonor);
routes.post('/donors/:id/donation', createDonation);
routes.delete('/donors/:id/donation', deleteLastDonation);
routes.get('/stock', countAndUpdateBloodTypes);

export default routes;