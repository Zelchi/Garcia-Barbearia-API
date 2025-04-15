import { AppDataSource } from "./data";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

const allowedOrigins = process.env.NODE_ENV === "DEV" ? ["http://localhost:3000"] : [];
app.use(cors({
    origin: allowedOrigins
}));

import agendamentos from "./Agendamentos/AgendaRouter";
app.use("/api/agendamentos", agendamentos);

AppDataSource.initialize().then(() => {
    console.log("Conectado ao banco de dados")
}).catch((error) => {
    console.log("Erro ao conectar ao banco de dados", error)
});

export default app;