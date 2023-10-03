import { Router } from 'express';
import { createDonor, getDonors, createDonation, updateDonor, deleteDonor, deleteLastDonation } from '../controllers/DonorController.js';
import countAndUpdateBloodTypes from '../controllers/BloodStockController.js';

const routes = Router();

routes.post('/donors', createDonor);
routes.get('/donors/:id?', getDonors); // O id é opcional
routes.post('/donors/:id/donation', createDonation);
routes.patch('/donors/:id', updateDonor);
routes.delete('/donors/:id', deleteDonor);
routes.get('/stock', countAndUpdateBloodTypes);
routes.delete('/donors/:id/donation', deleteLastDonation);

export default routes;