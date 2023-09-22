import express from "express";
const router = express.Router();

// Dados fixos
let doador = [
    {
        id: 1,
        nome: "João",
        idade: 30,
        tipoSanguineo: "A+",
        dataUltimaDoacao: "2023-01-01",
        endereco: "Rua Central, 123",
        contato: "(11) 12345-6789"
    },
    {
        id: 2,
        nome: "Maria",
        idade: 28,
        tipoSanguineo: "O-",
        dataUltimaDoacao: "2023-02-01",
        endereco: "Rua Lateral, 456",
        contato: "(11) 98765-4321"
    },
    {
        id: 3,
        nome: "Paulo",
        idade: 35,
        tipoSanguineo: "AB+",
        dataUltimaDoacao: "2023-03-01",
        endereco: "Avenida Principal, 789",
        contato: "(11) 11223-3344"
    }
];

// Rota para cadastrar doador (CREATE)
router.post("/", (req, res) => {
    const novoDoador = req.body;
    novoDoador.id = doador.length + 1; // Gera um novo ID
    doador.push(novoDoador);
    res.status(201).send("Doador cadastrado com sucesso!");
});

// Rota para obter todos os doadores (READ)
router.get("/", (req, res) => {
    res.status(200).json(doador);
});

// Rota para atualizar um doador (UPDATE)
router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const atualizaDoador = req.body;

    doador = doador.map(d =>
        d.id === Number(id) ? { ...d, ...atualizaDoador } : d
    );

    res.send(`Doador com ID ${id} atualizado com sucesso!`);
});

// Rota para deletar um doador (DELETE)
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    doador = doador.filter(d => d.id !== Number(id));

    res.send(`Doador com ID ${id} removido com sucesso!`);
});

export default router;
