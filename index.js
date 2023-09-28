import express from "express";
import mongoose from "mongoose";
import doadorRoutes from "./src/routes/doadorRoutes.js";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexão com MongoDB estabelecida com sucesso!'))
.catch(error => console.log('Erro na conexão com MongoDB: ' + error.message));

app.use(express.json());

app.use("/doador", doadorRoutes);

app.listen(PORT, () => {
    console.log("Serviço rodando na porta 3000");
});