import Donor from '../../models/Donor.js';
import {
    createDonor,
    getDonor,
    updateDonor,
    deleteDonor,
} from '../../controllers/donorController.js'; // Importa as funções que serão testadas
import { findDonorByIdOrName } from '../../utils/FindDonor.js'; 
jest.mock('../../utils/FindDonor.js'); 

jest.mock('../../models/Donor.js'); // Mock do modelo Donor

describe('Donor Controller', () => {
    describe('createDonor', () => {
        it('should create a new donor', async () => {
            const request = {
                body: {
                    CPF: '419.688.540-37',
                    email:'teste@example.com'
                },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the save function of Donor model
            Donor.prototype.save = jest.fn();

            await createDonor(request, response);

            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith({ message: 'Doador cadastrado com sucesso!' });
        });

        it('should return an error if the CPF is valid', async () => {
            const request = {
              body: {
                // Simulate valid CPF
                CPF: '1234567',
              },
            };
            const response = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
        
            await createDonor(request, response);
        
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: 'O CPF fornecido não é válido.' });
          });
        
    });

    describe('getDonor', () => {
        it('should find a donor by ID', async () => {
            const mockId = '34456';
            const mockDonor = { _id: mockId, name: 'John Doe' };
            const mockRequest = { params: { id: mockId }, query: {} };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Simula a função findDonorByIdOrName para retornar um doador com base no ID fornecido
            findDonorByIdOrName.mockResolvedValue([mockDonor]);
    
            await getDonor(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([mockDonor]);
        });
    });

    describe('updateDonor', () => {
        it('should update a donor by ID', async () => {
            const request = {
                params: {
                    id: 'valid_id',
                },
                body: {
                  
                },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByIdAndUpdate function of Donor model
            Donor.findByIdAndUpdate = jest.fn().mockResolvedValue({});

            await updateDonor(request, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({ message: 'Doador com ID valid_id atualizado com sucesso!' });
        });

    });

    describe('deleteDonor', () => {
        it('should delete a donor by ID', async () => {
            const doadorId = 223456
            const request = {
                params: {
                    id: doadorId,
                },
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByIdAndRemove function of Donor model
            Donor.findByIdAndRemove = jest.fn().mockResolvedValue({ /* Removed donor object */ });
            await deleteDonor(request, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({ message: `Doador com ID ${doadorId} deletado com sucesso!` });
        });
    });
});
