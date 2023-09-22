import express from "express";
import doadorRoutes from "./routes/doadorRoutes.js";
import hemocentroRoutes from "./routes/hemocentroRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/doador", doadorRoutes);
app.use("/hemocentro", hemocentroRoutes);

app.listen(PORT, () => {
    console.log("Serviço rodando na porta 3000");
});
