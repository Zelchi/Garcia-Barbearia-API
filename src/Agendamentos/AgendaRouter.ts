import express from "express";
const router = express.Router();

import { agendaController } from "./AgendaController";

// Middleware para verificar se o usuário está autenticado
router.use((req, res, next) => {agendaController.middleware(req, res, next)});
// Rota para visualizar agendamento
router.get("/", (req, res) => agendaController.userGet(req, res));
router.get("/:id", (req, res) => agendaController.userGet(req, res));
// Rota de criação de agendamento
router.post("/", (req, res) => agendaController.userPost(req, res));
// Rota para apagar agendamento
router.delete("/:id", (req, res) => agendaController.userDelete(req, res));

export default router;