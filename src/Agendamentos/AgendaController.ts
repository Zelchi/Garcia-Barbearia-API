import { Request, Response, } from "express";
import { db } from "./AgendaRepository";

export class AgendaController {

    public userPost = async (req: Request, res: Response): Promise<void> => {
        const { user, date, name } = req.body;
        const userID = Number(user);

        if (!user || !date || !name) {
            res.status(400).send("Nome e data são obrigatórios");
            return;
        }

        const data = new Date(date);
        const hora = data.getHours();
        const min = data.getMinutes();
        const dia = data.getDay();

        if (dia === 0) {
            res.status(400).send("Agendamentos só podem ser feitos de Segunda-feira a Sábado");
            return;
        }

        if (
            isNaN(data.getTime()) ||
            hora < 11 || hora > 18 ||
            (min !== 0 && min !== 30)
        ) {
            res.status(400).send("A data deve estar entre 11:00 e 18:00, em intervalos de 30 minutos");
            return;
        }

        try {
            if (await db.verificarAgendamento(userID)) {
                res.status(409).send("Agendamento já existe para este usuário!");
                return;
            }
            if (await db.verificarData(date)) {
                res.status(401).send("Data já existe!");
                return;
            }
            await db.criarAgendamento(userID, name, date);
            res.status(201).send("Agendamento criado com sucesso");
            return;
        } catch (error) {
            console.error("< Agendamentos -> Controller -> Erro ao criar agendamento:", error);
            res.status(500).send("Erro ao criar agendamento");
            return;
        }
    }

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
    }

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
    }
}

export const agendaController = new AgendaController();