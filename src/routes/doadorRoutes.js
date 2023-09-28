import express from 'express';
import Doador from '../models/Doador.js';
import moment from 'moment-timezone';

const router = express.Router();

// Rota para cadastrar doador (CREATE)
router.post("/", async (req, res) => {
    const novoDoador = new Doador(req.body);
    try {
        await novoDoador.save();
        res.status(201).send("Doador cadastrado com sucesso!");
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao cadastrar o doador. Por favor, tente novamente.");
    }
});

// Rota para obter um doador pelo nome (READ)
router.get("/:nome", async (req, res) => {
    const { nome } = req.params;
    try {
        const doador = await Doador.findOne({ nome: nome });
        if (!doador) {
            res.status(404).json("Doador não encontrado");
        } else {
            res.status(200).json(doador);
        }
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao buscar o doador. Por favor, tente novamente.");
    }
});

router.post("/:nome/doacao", async (req, res) => {
    const { nome } = req.params;
    try {
        const doador = await Doador.findOne({ nome: nome });
        if (!doador) {
            res.status(404).json("Doador não encontrado");
        } else {
            // Adiciona a data atual ao histórico de doações
            doador.historicoDoacoes.push(moment().tz("America/Sao_Paulo").format('YYYY-MM-DDTHH:mm:ss'));
            await doador.save();
            res.send(`Nova doação registrada para o doador ${nome}!`);
        }
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao registrar a doação. Por favor, tente novamente.");
    }
});


// Rota para atualizar um doador (UPDATE)
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const doadorAtualizado = await Doador.findByIdAndUpdate(id, req.body, { new: true });
        if (!doadorAtualizado) {
            res.status(404).json("Doador não encontrado");
        } else {
            res.send(`Doador com ID ${id} atualizado com sucesso!`);
        }
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao atualizar o doador. Por favor, tente novamente.");
    }
});

// Rota para deletar um doador (DELETE)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const doadorRemovido = await Doador.findByIdAndRemove(id);
        if (!doadorRemovido) {
            res.status(404).json("Doador não encontrado");
        } else {
            res.send(`Doador com ID ${id} removido com sucesso!`);
        }
    } catch (error) {
        res.status(500).send("Ocorreu um erro ao remover o doador. Por favor, tente novamente.");
    }
});

export default router;