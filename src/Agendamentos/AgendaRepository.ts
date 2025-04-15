import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { AgendaEntity } from "./AgendaEntity";

class AgendaRepository {
    private database: Repository<AgendaEntity>;

    constructor(repository: Repository<AgendaEntity>) {
        this.database = repository;
    }

    criarAgendamento = async (user: string, name: string, date: string): Promise<boolean> => {
        const contaEntity = new AgendaEntity(name, user, date);
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

    verificarAgendamento = async (user: string): Promise<AgendaEntity | null> => {
        const agendamento = await this.database.findOneBy({ user });
        return agendamento;
    }

    buscarAgendamentoUsuario = async (user: string): Promise<AgendaEntity[] | null> => {
        return await this.database.findBy({ user });
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