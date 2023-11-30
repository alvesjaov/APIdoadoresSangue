const { createDonation, readDonation, deleteDonation } = require('../../controllers/DonationController');

// Mock dos objetos request e response
const mockRequest = (id) => ({
    params: { id },
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
jest.mock('../../models/Donor'); // Importa o módulo Donor
const Donor = require('../../models/Donor');
jest.mock('../../models/Donor', () => {
    const mockDonor = {
        findOne: jest.fn(),
        findById: jest.fn(),
    };

    return mockDonor;
});


describe('createDonation', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Deve registrar uma nova doação corretamente', async () => {
        const mockId = 'id_do_doador';
        const mockDonor = { donationHistory: [], save: jest.fn() };
        const mockDate = new Date();

        Donor.findById.mockResolvedValue(mockDonor);

        const req = mockRequest(mockId);
        const res = mockResponse();

        await createDonation(req, res);

        expect(Donor.findById).toHaveBeenCalledWith(mockId);
        expect(mockDonor.donationHistory).toHaveLength(1);
        expect(mockDonor.donationHistory[0].donationDate instanceof Date).toBe(true);
        expect(mockDonor.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: `Nova doação registrada para o doador com ID ${mockId}!` });
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
            error: `Ocorreu um erro ao registrar a doação, tente novamente.`,
        });

    });
});
describe('readDonation', () => {
    it('should find and return a specific donation', async () => {
        const mockDonationId = '987654';
        const mockDonation = {
          _id: mockDonationId,
          date: '2023-01-01T00:00:00'
          // Outras propriedades da doação simulada...
        };
        const mockDonor = {
          _id: '1234567',
          donationHistory: [mockDonation],
        };
      
        // Configuração do mock para retornar um doador simulado ao chamar Donor.findOne
        const findOneMock = require('../../models/Donor').findOne;
        findOneMock.mockResolvedValue(mockDonor);
      
        const mockRequest = { params: { id: mockDonationId } };
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Chama a função readDonation
        await readDonation(mockRequest, mockResponse);
      
        // Assertions
        expect(findOneMock).toHaveBeenCalledWith({ "donationHistory._id": mockDonationId });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockDonation); // Retorna a doação, não o doador inteiro
      });
      
  
    test('Deve retornar mensagem de erro se a doação não for encontrada', async () => {
      Donor.findOne = jest.fn().mockResolvedValue(null);
  
      const req = mockRequest('idInexistente');
      const res = mockResponse();
      await readDonation(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Doação não encontrada' });
    });
  
    test('Deve retornar mensagem de erro se ocorrer um erro ao buscar a doação', async () => {
      Donor.findOne = jest.fn().mockRejectedValue(new Error('Erro ao buscar doação'));
  
      const req = mockRequest('idComErro');
      const res = mockResponse();
      await readDonation(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao buscar a doação. Por favor, tente novamente' });
    });
  });

describe('deleteDonation', () => {
    // it('should delete a specific donation', async () => {
    //     const mockDonationId = '987654'; // ID simulado para uma doação

    //     const mockDonation = {
    //         _id: mockDonationId,
    //         date: '2023-01-01T00:00:00'
    //         // Outras propriedades da doação simulada...
    //     };

    //     const mockDonor = {
    //         _id: '1234567',
    //         donationHistory: [mockDonation], // Simula um doador com histórico de doações
    //         save: jest.fn(), // Mock para a função save do modelo Donor
    //         donationHistory: {
    //             pull: jest.fn(), // Mock para a função pull do array donationHistory
    //         },
    //     };

    //     // Configura o mock para o método findOne do modelo Donor para retornar o doador simulado
    //     Donor.findOne.mockResolvedValue(mockDonor);

    //     const mockRequest = { params: { id: mockDonationId } };
    //     const mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     };

    //     // Chama a função deleteDonation
    //     const result = await deleteDonation(mockRequest, mockResponse);
    //     console.log(result);
    //     // Verificações

    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: `Doação com ID ${mockDonationId} deletada com sucesso!` });
    // });

    it('should handle non-existing donation', async () => {
        // Mock para retornar nenhum doador
        Donor.findOne.mockResolvedValue(null);

        const mockRequest = { params: { id: 'nonExistingId' } };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Chama a função deleteDonation
        await deleteDonation(mockRequest, mockResponse);

        // Verificações
        expect(Donor.findOne).toHaveBeenCalledWith({ "donationHistory._id": 'nonExistingId' });
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Doação não encontrada' });
    });

    it('should handle errors during donation deletion', async () => {
        const mockDonationId = 'errorId';
        const mockError = new Error('Mocked error message');

        // Mock para retornar um erro
        Donor.findOne.mockRejectedValue(mockError);

        const mockRequest = { params: { id: mockDonationId } };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Chama a função deleteDonation
        await deleteDonation(mockRequest, mockResponse);

        // Verificações
        expect(Donor.findOne).toHaveBeenCalledWith({ "donationHistory._id": mockDonationId });
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: `Ocorreu um erro ao deletar a doação com ID ${mockDonationId}, tente novamente.`,
        });
    });
});