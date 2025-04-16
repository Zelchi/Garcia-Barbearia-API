import { Request, Response, NextFunction } from "express";
import { db } from "./AgendaRepository";
import jwt from "jsonwebtoken";

export class AgendaController {
    public middleware = (req: Request, res: Response, next: NextFunction) => {
        const pegaToken = req.headers.authorization;
        const token = pegaToken?.split(" ")[1];

        if (!token) {
            res.status(401).send("Token não informado ou mal formatado");
            return;
        }

        const secret = process.env.JWT;
        if (!secret) {
            res.status(500).send("JWT secret não configurado");
            return;
        }

        try {
            jwt.verify(token, secret);
            next();
        } catch (err) {
            res.status(401).send("Token inválido");
        }
    };

    public userPost = async (req: Request, res: Response): Promise<void> => {
        const { date } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!date) {
            res.status(400).send("data é obrigatória");
            return;
        }

        const secret = process.env.JWT;
        if (!secret) {
            res.status(500).send("JWT secret não configurado");
            return;
        }

        try {
            const decoded = jwt.decode(token as string) as { id: number, name: string };
            const data = new Date(date);

            if (isNaN(data.getTime())) {
                res.status(400).send("Data inválida");
                return;
            }

            const hora = data.getHours();
            const min = data.getMinutes();
            const dia = data.getDay();

            if (dia === 0) {
                res.status(400).send("Agendamentos só podem ser feitos de Segunda-feira a Sábado");
                return;
            }

            if (hora < 11 || hora > 18 || (min !== 0 && min !== 30)) {
                res.status(400).send("A data deve estar entre 11:00 e 18:00, em intervalos de 30 minutos");
                return;
            }

            if (await db.verificarAgendamento(decoded.id)) {
                res.status(409).send("Agendamento já existe para este usuário!");
                return;
            }

            if (await db.verificarData(date)) {
                res.status(401).send("Data já existe!");
                return;
            }

            if (await db.criarAgendamento(decoded.id, decoded.name, date)) {
                res.status(201).send("Agendamento criado com sucesso");
            } else {
                res.status(500).send("Erro ao criar agendamento");
            }

        } catch (error) {
            console.error("< Agendamentos -> Controller -> Erro ao criar agendamento:", error);
            res.status(500).send("Erro ao criar agendamento");
        }
    };

    public userGet = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const userID = Number(id);

        if (!id) {
            try {
                const agendamentos = await db.buscarTodosAgendamentos();
                res.status(200).send(agendamentos);
                return;
            } catch (error) {
                console.error("< Agendamentos -> Controller -> Erro ao buscar todos os agendamentos:", error);
                res.status(500).send("Erro ao buscar agendamentos");
                return;
            }
        } else {
            try {
                const agendamentos = await db.buscarAgendamentoUsuario(userID);
                if (agendamentos) {
                    res.status(200).send(agendamentos);
                    return;
                } else {
                    res.status(404).send("Nenhum agendamento encontrado para este usuário");
                    return;
                }
            } catch (error) {
                console.error("< Agendamentos -> Controller -> Erro ao buscar agendamentos:", error);
                res.status(500).send("Erro ao buscar agendamentos");
                return;
            }
        }
    };

    public userDelete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send("ID é obrigatório");
            return;
        } else {
            try {
                await db.deletarAgendamento(Number(id));
                res.status(200).send("Agendamento deletado com sucesso");
                return;
            } catch (error) {
                console.error("< Agendamentos -> Controller -> Erro ao deletar agendamento:", error);
                res.status(500).send("Erro ao deletar agendamento");
                return;
            }
        }
    };
}

export const agendaController = new AgendaController();