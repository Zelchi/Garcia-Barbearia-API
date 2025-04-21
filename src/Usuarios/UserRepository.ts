import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { UserEntity } from "./UserEntity";

class UserRepository {
    private database: Repository<UserEntity>;
    constructor(repository: Repository<UserEntity>) {
        this.database = repository;
    }

    criarUsuario = async (name: string, email: string): Promise<UserEntity | null> => {
        const userEntity = new UserEntity(name, email);
        try {
            return await this.database.save(userEntity);
        }
        catch (error) {
            console.error("UserRepository -> criarUsuario -> ", error);
            return null;
        }
    }

    verificarUsuario = async (email: string): Promise<UserEntity | null> => {
        const usuario = await this.database.findOneBy({ email });
        return usuario;
    }
}

export const db = new UserRepository(AppDataSource.getRepository(UserEntity));