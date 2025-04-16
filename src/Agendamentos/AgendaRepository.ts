import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { AgendaEntity } from "./AgendaEntity";
import { UserEntity } from "../Usuarios/UserEntity";

class AgendaRepository {
    private database: Repository<AgendaEntity>;
    private userDatabase: Repository<UserEntity>;

    constructor(repository: Repository<AgendaEntity>, userRepository: Repository<UserEntity>) {
        this.database = repository;
        this.userDatabase = userRepository;
    }

    criarAgendamento = async (userId: number, name: string, date: string): Promise<boolean> => {
        try {
            if (!name) {
                throw new Error("O campo 'name' é obrigatório.");
            }
    
            const user = await this.userDatabase.findOneBy({ id: userId });
            if (!user) {
                throw new Error("Usuário não encontrado");
            }
    
            const contaEntity = new AgendaEntity(name, date);
            contaEntity.user = user;
    
            await this.database.save(contaEntity);
            return true;
        } catch (error) {
            console.error("AgendaRepository -> criarAgendamento -> ", error);
            return false;
        }
    };

    verificarData = async (date: string): Promise<AgendaEntity | null> => {
        const agendamento = await this.database.findOneBy({ date });
        return agendamento;
    };

    verificarAgendamento = async (user: number): Promise<AgendaEntity | null> => {
        const agendamento = await this.database.findOneBy({ user: { id: user } });
        return agendamento;
    };

    buscarAgendamentoUsuario = async (userID: number): Promise<AgendaEntity[] | null> => {
        return await this.database.findBy({ user: { id: userID } });
    };

    buscarTodosAgendamentos = async (): Promise<AgendaEntity[] | null> => {
        return await this.database.find();
    };

    deletarAgendamento = async (id: number): Promise<boolean> => {
        try {
            await this.database.softDelete({ id });
            return true;
        } catch (error) {
            console.error("AgendaRepository -> deletarAgendamento -> ", error);
            return false;
        }
    };
}

export const db = new AgendaRepository(
    AppDataSource.getRepository(AgendaEntity),
    AppDataSource.getRepository(UserEntity)
);