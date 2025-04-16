import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { AgendaEntity } from "./AgendaEntity";

class AgendaRepository {
    private database: Repository<AgendaEntity>;

    constructor(repository: Repository<AgendaEntity>) {
        this.database = repository;
    }

    criarAgendamento = async (userID: number, name: string, date: string): Promise<boolean> => {
        const contaEntity = new AgendaEntity(name, userID, date);
        try {
            await this.database.save(contaEntity);
            return true;
        }
        catch (error) {
            console.error("AgendaRepository -> criarAgendamento -> ", error);
            return false;
        }
    }

    verificarData = async (date: string): Promise<AgendaEntity | null> => {
        const agendamento = await this.database.findOneBy({ date });
        return agendamento;
    }

    verificarAgendamento = async (userID: number): Promise<AgendaEntity | null> => {
        const agendamento = await this.database.findOneBy({ userID });
        return agendamento;
    }

    buscarAgendamentoUsuario = async (userID: number): Promise<AgendaEntity[] | null> => {
        return await this.database.findBy({ userID });
    }

    buscarTodosAgendamentos = async (): Promise<AgendaEntity[] | null> => {
        return await this.database.find();
    }

    deletarAgendamento = async (id: number): Promise<boolean> => {
        try {
            await this.database.softDelete({ id });
            return true;
        }
        catch (error) {
            console.error("AgendaRepository -> deletarAgendamento -> ", error);
            return false;
        }
    }
}

export const db = new AgendaRepository(AppDataSource.getRepository(AgendaEntity));