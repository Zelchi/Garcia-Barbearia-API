import { PrimaryGeneratedColumn, Column, Entity, DeleteDateColumn } from "typeorm";

@Entity("Agendamentos")
export class AgendaEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "integer" })
    userID: number;

    @Column({ type: "varchar", length: 25 })
    date: string;

    @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
    creation!: Date;

    @DeleteDateColumn({ type: "date", nullable: true })
    deletedAt?: Date | null;

    constructor(
        name: string,
        userID: number,
        date: string,
    ) {
        this.name = name;
        this.userID = userID;
        this.date = date;
    }
}