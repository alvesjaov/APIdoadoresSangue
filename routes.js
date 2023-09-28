import { Router } from 'express';
import { getDonors, createDonor, createDonation, updateDonor, deleteDonor } from './src/controllers/DonorController.js';

const routes = Router();

routes.get('/:name?', getDonors); // O nome é opcional
routes.post('/', createDonor);
routes.post('/:id/donation', createDonation);
routes.patch('/:id', updateDonor);
routes.delete('/:id', deleteDonor);

export default routes;