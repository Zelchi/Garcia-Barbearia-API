import { DataSource } from "typeorm";
import { AgendaEntity } from "./Agendamentos/AgendaEntity";
import { UserEntity } from "./Usuarios/UserEntity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [AgendaEntity, UserEntity],
    synchronize: true,
});