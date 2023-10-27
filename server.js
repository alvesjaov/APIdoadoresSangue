import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { readFile } from 'fs/promises';
import swaggerUi from 'swagger-ui-express';

// Importando rotas
import loginRoutes from './src/routes/loginRoutes.js';
import employeeRoutes from './src/routes/employeeRoutes.js';
import donorRoutes from './src/routes/donorRoutes.js';
import donationRoutes from './src/routes/donationRoutes.js';
import stockRoutes from './src/routes/stockRoutes.js';

// Importando configuração do Passport
import configurePassport from './src/middleware/PassportConfig.js';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Função para obter o documento Swagger
async function getSwaggerDocument() {
  const data = await readFile('./swagger.json');
  return JSON.parse(data);
}

// Conecta-se ao MongoDB e inicia o servidor Express
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.use(express.json());
    app.use(passport.initialize()); // Inicializa o Passport.js

    await configurePassport(); // Configura a estratégia JWT

    // Configurando rotas
    app.use(loginRoutes);
    app.use(employeeRoutes);
    app.use(donorRoutes);
    app.use(donationRoutes);
    app.use(stockRoutes);
    

    // Configurando Swagger UI
    const swaggerDocument = await getSwaggerDocument();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(PORT, () => {
      console.log(`Serviço rodando na porta ${PORT} e conexão com MongoDB estabelecida com sucesso.`);
    });
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
  }
}

startServer();
