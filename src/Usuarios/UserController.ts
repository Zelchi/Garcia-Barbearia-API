import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "./UserRepository";
import jwt from "jsonwebtoken";

export class UserController {
    public userPost = async (req: Request, res: Response) => {
        const { credential, clientId } = req.body;
        const { authorization } = req.headers;

        if (credential && clientId) {
            const client = new OAuth2Client(clientId, credential);
            try {
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: clientId,
                });
                const payload = ticket.getPayload();
                if (payload) {
                    const { name, email } = payload;
                    const usuario = await db.verificarUsuario(email!);
                    if (!usuario) {
                        await db.criarUsuario(name!, email!);
                    }
                    const token = jwt.sign(
                        { id: usuario?.id, name: usuario?.name, email: usuario?.email },
                        process.env.JWT!,
                        { expiresIn: "7d" }
                    );
                    res.status(200).json({ message: "Usuário autenticado com sucesso", authorization: token });
                    return;
                } else {
                    res.status(401).json({ message: "Token inválido" });
                    return;
                }
            } catch (error) {
                console.error("UserController -> userPost -> ", error);
                res.status(500).json({ message: "Erro ao autenticar usuário" });
                return;
            }
        }

        if (authorization) {
            const token = req.headers["authorization"]?.split(" ")[1];
            jwt.verify(token!, process.env.JWT!, (err: any) => {
                if (err) {
                    res.status(401).json({ message: "Token inválido" });
                    return;
                } else {
                    res.status(200).json({ message: "Token válido" });
                    return;
                }
            });
            return;
        }

        if (!credential || !clientId) {
            res.status(400).send("Credenciais inválidas");
            return;
        }

        if (!authorization) {
            res.status(401).json({ message: "Token não fornecido" });
            return;
        }
    };
}

export const userController = new UserController();