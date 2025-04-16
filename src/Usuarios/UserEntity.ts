import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { AgendaEntity } from "../Agendamentos/AgendaEntity";

@Entity("Usuarios")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "varchar", length: 20, default: "user" })
    cargo: string;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
    creation!: Date;

    @OneToMany(() => AgendaEntity, (agenda) => agenda.user)
    agendas!: AgendaEntity[];

    constructor(
        name: string,
        email: string,
    ) {
        this.name = name;
        this.email = email;
        this.cargo = "user";
    }
}