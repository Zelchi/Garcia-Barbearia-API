import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "./UserRepository";
import jwt from "jsonwebtoken";

export class UserController {
    public middleware = async (req: Request, res: Response, next: () => void) => {
        console.log("Hit endpoint: User");
        try {
            const pegaToken = req.headers.authorization;
            if (!pegaToken) {
                return next(); 
            }
    
            const token = pegaToken.split(" ")[1];
            if (!token) {
                return next(); 
            }
    
            const decoded = jwt.decode(token) as { id: number; name: string; cargo: string; email: string };
            if (!decoded || !decoded.email) {
                return next(); 
            }
    
            const { name, email, cargo } = decoded;
            const usuario = await db.verificarUsuario(email);
    
            if (usuario) {
                return next(); 
            }
    
            await db.criarUsuario(name, email, cargo);
            return next();
        } catch (error) {
            console.error("Erro no middleware:", error);
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    };

    public userPost = async (req: Request, res: Response) => {
        const { credential, clientId, role } = req.body;
        const { authorization } = req.headers;

        let cargo = "user";
        if (role == "1") cargo = "admin";
        if (role == "2") cargo = "dono";

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
                    let usuario = await db.verificarUsuario(email!);
                    if (!usuario) {
                        usuario = await db.criarUsuario(name!, email!, cargo);
                        if (!usuario) {
                            res.status(500).json({ message: "Erro ao criar usuário" });
                            return;
                        }
                    }
                    if (process.env.JWT == undefined) {
                        res.status(500).json({ message: "JWT não configurado" });
                        return;
                    }
                    const token = jwt.sign(
                        { id: usuario.id, name: usuario.name, email: usuario.email, cargo: usuario.cargo }, 
                        process.env.JWT, 
                        { expiresIn: `${50 * 365}d` }
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
            if (!token) {
                res.status(401).json({ message: "Token não fornecido" });
                return;
            }
            const decoded = jwt.decode(token as string) as { id: number; name: string; cargo: string };
            jwt.verify(token, process.env.JWT!, (err: any) => {
                if (err) {
                    res.status(401).json({ message: "Token inválido" });
                    return;
                } else if (decoded.cargo == "user") {
                    res.status(200).json({ message: "User: Token válido" });
                    return;
                } else {
                    res.status(202).json({ message: "Admin: Token válido" });
                    return;
                }
            });
            return;
        }

        res.status(400).send("Credenciais inválidas");
    };
}

export const userController = new UserController();