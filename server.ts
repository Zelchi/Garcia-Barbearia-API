import 'reflect-metadata';
import app from "./src/app";
import dotenv from "dotenv"; dotenv.config();
import cron from 'node-cron';

const PORT = 3000;

cron.schedule('0 0 1 * *', () => { console.log('Running a job at 01:00 at America/Sao_Paulo timezone'); }, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

app.listen(PORT);

console.log(`Servidor rodando na porta ${PORT}`)