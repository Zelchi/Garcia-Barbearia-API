import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, DeleteDateColumn } from "typeorm";
import { UserEntity } from "../Usuarios/UserEntity";

@Entity("Agendamentos")
export class AgendaEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 8 })
    dia: string;

    @Column({ type: "varchar", length: 5 })
    hora: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
    creation!: Date;

    @DeleteDateColumn({ type: "date", nullable: true })
    deletedAt?: Date | null;

    @ManyToOne(() => UserEntity, (user) => user.agendas)
    user!: UserEntity;

    constructor(
        name: string,
        hora: string,
        dia: string,
    ) {
        this.name = name;
        this.hora = hora;
        this.dia = dia;
    }
}