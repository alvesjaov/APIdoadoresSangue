import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";

// Importando rotas
import donorRoutes from './routes/donorRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

// Importando configuração do Passport
import configurePassport from "./src/middleware/PassportConfig.js";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

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
    app.use('/donors', donorRoutes);
    app.use('/donations', donationRoutes);
    app.use('/stock', stockRoutes);
    app.use('/employees', employeeRoutes);

    app.listen(PORT, () => {
      console.log(`Serviço rodando na porta ${PORT} e conexão com MongoDB estabelecida com sucesso.`);
    });
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
  }
}

startServer();