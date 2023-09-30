import { Router } from 'express';
import { getDonors, createDonor, createDonation, updateDonor, deleteDonor } from '../controllers/DonorController.js';
import { countAndUpdateBloodTypes } from '../controllers/BloodStockController.js';

const routes = Router();

routes.get('/donors/:id?', getDonors); // O id é opcional
routes.post('/donors', createDonor);
routes.post('/donors/:id/donation', createDonation);
routes.patch('/donors/:id', updateDonor);
routes.delete('/donors/:id', deleteDonor);
routes.get('/stock', countAndUpdateBloodTypes);

export default routes;
