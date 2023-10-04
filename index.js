import express from "express";
import mongoose from "mongoose";
import routes from "./src/routes/routes.js";
import dotenv from "dotenv";

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
    app.use(routes);

    app.listen(PORT, () => {
      console.log(`Serviço rodando na porta ${PORT} e conexão com MongoDB estabelecida com sucesso.`);
    });
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
  }
}

startServer();