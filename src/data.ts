import { DataSource } from "typeorm";
import { AgendaEntity } from "./Agendamentos/AgendaEntity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [AgendaEntity],
    synchronize: true,
});