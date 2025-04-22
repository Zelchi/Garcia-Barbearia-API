import { Repository, MoreThan } from "typeorm";
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

    criarAgendamento = async (userId: number, name: string, hora: string, dia: string): Promise<boolean> => {
        try {
            if (!name) {
                throw new Error("O campo 'name' é obrigatório.");
            }
    
            const user = await this.userDatabase.findOneBy({ id: userId });
            if (!user) {
                throw new Error("Usuário não encontrado");
            }
    
            const contaEntity = new AgendaEntity(name, hora, dia);
            contaEntity.user = user;
    
            await this.database.save(contaEntity);
            return true;
        } catch (error) {
            console.error("AgendaRepository -> criarAgendamento -> ", error);
            return false;
        }
    };

    verificarDia = async (dia: string): Promise<AgendaEntity[]> => {
        return await this.database.findBy({ dia });
    };

    verificarAgendamento = async (user: number): Promise<AgendaEntity[] | null> => {
        const currentDate = new Date();
        const agendamento = await this.database.find({
            where: {
                user: { id: user },
                dia: MoreThan(currentDate.toISOString().split("T")[0] as string),
            }
        });
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