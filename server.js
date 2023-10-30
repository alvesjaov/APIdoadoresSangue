import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

// Importando rotas
import routes from './src/routes/indexRoutes.js';

// Importando configuração do Passport
import configurePassport from './src/middleware/PassportConfig.js';

// Configurando dotenv
dotenv.config();

// Configurando express e variáveis de ambiente
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Configurando require para importação de JSON
const require = createRequire(import.meta.url);
const swaggerDocument = require('./src/config/swagger.json');

// Função para iniciar o servidor
async function startServer() {
  try {
    // Conectando ao MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Configurando middleware do express e Passport
    app.use(express.json());
    app.use(passport.initialize());

    // Configurando estratégia JWT do Passport
    await configurePassport();

    // Configurando rotas
    app.use(routes);

    // Configurando Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Iniciando o servidor
    app.listen(PORT, () => {
      console.log(`Serviço rodando na porta ${PORT} e conexão com MongoDB estabelecida com sucesso.`);
    });
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
  }
}

// Iniciando o servidor
startServer();
