import { PrimaryGeneratedColumn, Column, Entity, DeleteDateColumn } from "typeorm";

@Entity()
export class AgendaEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    userID: string;

    @Column({ type: "varchar", length: 255 })
    date: string;

    @Column({ type: "varchar", length: 255 })
    creation: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    constructor(
        name: string,
        user: string,
        date: string,
    ) {
        this.name = name;
        this.userID = user;
        this.date = date;
        this.creation = new Date();
    }
}