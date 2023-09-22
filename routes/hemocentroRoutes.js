import express from "express";
const router = express.Router();

// Dados fixos
let hemocentro = [
    {
        id: 1,
        nome: "Hemocentro Central",
        endereco: "Avenida Principal, 456",
        contato: "(11) 98765-4321"
    },
    {
        id: 2,
        nome: "Hemocentro Regional",
        endereco: "Rua Lateral, 123",
        contato: "(11) 11223-3344"
    }
];

// Rota para cadastrar hemocentro (CREATE)
router.post("/", (req, res) => {
    const novoHemocentro = req.body;
    novoHemocentro.id = hemocentro.length + 1; // Gera um novo ID
    hemocentro.push(novoHemocentro);
    res.status(201).send("Hemocentro cadastrado com sucesso!");
});

// Rota para obter todos os hemocentros (READ)
router.get("/", (req, res) => {
    res.status(200).json(hemocentro);
});

// Rota para atualizar um hemocentro (UPDATE)
router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const atualizaHemocentro = req.body;

    hemocentro = hemocentro.map(h =>
        h.id === Number(id) ? { ...h, ...atualizaHemocentro } : h
    );

    res.send(`Hemocentro com ID ${id} atualizado com sucesso!`);
});

// Rota para deletar um hemocentro (DELETE)
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    hemocentro = hemocentro.filter(h => h.id !== Number(id));

    res.send(`Hemocentro com ID ${id} removido com sucesso!`);
});

export default router;
