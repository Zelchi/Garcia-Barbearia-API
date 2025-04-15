import express from "express";
const router = express.Router();

import { agendaController } from "./AgendaController";

// Rota de criação de agendamento
router.post("/post", (req, res) => agendaController.userCreate(req, res));

// Rota para apagar agendamento
router.delete("/delete", (req, res) => agendaController.userDelete(req, res));

// Rota para visualizar agendamento
router.get("/getuser", (req, res) => agendaController.userGet(req, res));

// Rota para visualizar todos os agendamentos (admin)
router.get("/getall", (req, res) => agendaController.getAll(req, res));

export default router;