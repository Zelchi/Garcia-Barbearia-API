import { AppDataSource } from "./data";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"]
app.use(cors({
    origin: allowedOrigins,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
}));

import usuarios from "./Usuarios/UserRouter";
app.use("/api/usuarios", usuarios);

import agendamentos from "./Agendamentos/AgendaRouter";
app.use("/api/agendamentos", agendamentos);

AppDataSource.initialize().then(() => {
    console.log("Conectado ao banco de dados")
}).catch((error) => {
    console.log("Erro ao conectar ao banco de dados", error)
});

export default app;