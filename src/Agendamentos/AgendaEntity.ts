import { PrimaryGeneratedColumn, Column, Entity, DeleteDateColumn } from "typeorm";

@Entity()
export class AgendaEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column()
    user: string;

    @Column()
    date: string;

    @Column()
    creation: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    get isDeleted(): boolean {
        return !!this.deletedAt;
    }

    constructor(
        name: string,
        user: string,
        date: string,
    ) {
        this.name = name;
        this.user = user;
        this.date = date;
        this.creation = new Date();
    }
}