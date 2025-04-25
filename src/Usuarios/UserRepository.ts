import { Repository } from "typeorm";
import { AppDataSource } from "../data";
import { UserEntity } from "./UserEntity";

class UserRepository {
    private database: Repository<UserEntity>;
    constructor(repository: Repository<UserEntity>) {
        this.database = repository;
    }

    criarUsuario = async (name: string, email: string, cargo: string, idGoogle: string, idApple: string): Promise<UserEntity | null> => {
        const userEntity = new UserEntity(name, email, cargo, idGoogle, idApple);
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

    vincularGoogle = async (email: string, idGoogle: string): Promise<UserEntity | null> => {
        const usuario = await this.database.findOneBy({ email });
        if (!usuario) return null;
        usuario.idGoogle = idGoogle;
        try {
            return await this.database.save(usuario);
        } catch (error) {
            console.error("UserRepository -> atualizarUsuarioGoogle -> ", error);
            return null;
        }
    }

    vincularApple = async (email: string, idApple: string): Promise<UserEntity | null> => {
        const usuario = await this.database.findOneBy({ email });
        if (!usuario) return null;
        usuario.idApple = idApple;
        try {
            return await this.database.save(usuario);
        } catch (error) {
            console.error("UserRepository -> atualizarUsuarioApple -> ", error);
            return null;
        }
    }
}

export const db = new UserRepository(AppDataSource.getRepository(UserEntity));