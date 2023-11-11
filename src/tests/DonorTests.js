const { createDonation } = require('../controllers/DonationController');
import Donor from '../models/Donor';


// Mock the Donor model and its methods
jest.mock('../models/Donor');

describe('createDonation', () => {
    it('should create a donation', async () => {
        const mockId = '1234567';
        const mockDonor = {
            _id: mockId,
            donationHistory: [],
            save: jest.fn().mockResolvedValue(),
        };

        // Simular o método findById do modelo Doador
        Donor.findById.mockResolvedValue(mockDonor);

        const mockRequest = { params: { id: mockId } };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Chame a função createDonation
        await createDonation(mockRequest, mockResponse);

        // Assertions
        expect(Donor.findById).toHaveBeenCalledWith(mockId);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: `Nova doação registrada para o doador com ID ${mockId}!`,
        });

    });

    it('should handle a non-existing donor', async () => {
        const mockId = null;

        // Mock the findById method of the Donor model to return null (no donor found)
        Donor.findById.mockResolvedValue(mockId);

        const mockRequest = { params: { id: mockId } };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the createDonation function
        await createDonation(mockRequest, mockResponse);

        // Assertions
        expect(Donor.findById).toHaveBeenCalledWith(mockId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: `ID ${mockId} não corresponde a nenhum doador`,
        });
        // You may add more assertions based on your specific requirements
    });

    it('should handle an error during donation registration', async () => {
        const mockId = 'errorUserId';
        const mockError = new Error('Mock error message');

        // Mock the findById method of the Donor model to throw an error
        Donor.findById.mockRejectedValue(mockError);

        const mockRequest = { params: { id: mockId } };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the createDonation function
        await createDonation(mockRequest, mockResponse);

        // Assertions
        expect(Donor.findById).toHaveBeenCalledWith(mockId);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: `Ocorreu um erro ao registrar a doação. Por favor, tente novamente. Erro: ${mockError.message}`,
        });
       
    });
});
