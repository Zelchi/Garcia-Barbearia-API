import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import AppleSignin from "apple-signin-auth";
import { db } from "./UserRepository";
import jwt from "jsonwebtoken";

export class UserController {
    public userPost = async (req: Request, res: Response) => {
        const { credential, clientId, role, plataform } = req.body;
        const { isApple, nameApple } = plataform;
        const { authorization } = req.headers;

        let cargo = "user";
        if (role == "1") cargo = "admin";
        if (role == "2") cargo = "dono";

        if (credential && clientId) {

            if (isApple == false) { // Google Authentication
                const client = new OAuth2Client(clientId, credential);

                try {
                    const ticket = await client.verifyIdToken({
                        idToken: credential,
                        audience: clientId,
                    });
                    const payload = ticket.getPayload();
                    if (payload) {
                        const { name, email, sub } = payload;

                        if (!email) throw new Error("Email não encontrado no payload do Google");

                        let usuario = await db.verificarUsuario(email);
                        if (usuario && usuario.idApple && usuario.idGoogle == null) {
                            await db.vincularGoogle(usuario.email, sub);
                        };
                        if (!usuario) {
                            usuario = await db.criarUsuario(name!, email!, cargo, sub, plataform);
                            if (!usuario) throw new Error("Erro ao criar usuário");
                        };

                        const token = jwt.sign(
                            { id: usuario?.id, name: usuario?.name, email: usuario?.email, cargo: usuario?.cargo },
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

            if (isApple == true) { // Apple Authentication
                try {
                    const payload = await AppleSignin.verifyIdToken(credential, { audience: 'com.garcia.web', ignoreExpiration: true });

                    if (!payload) {
                        res.status(401).json({ message: "Token inválido" });
                        return;
                    }

                    const { sub, email } = payload;
                    if (!email) throw new Error("Email não encontrado no payload da Apple");

                    let usuario = await db.verificarUsuario(email);
                    if (usuario && usuario.idGoogle && usuario.idApple == null) {
                        await db.vincularApple(usuario.email, sub);
                    }
                    if (!usuario) {
                        usuario = await db.criarUsuario(nameApple, email, cargo, sub, plataform);
                        if (!usuario) {
                            throw new Error("Erro ao criar usuário");
                        }
                    }

                    const token = jwt.sign(
                        { id: usuario.id, name: usuario.name, email: usuario.email, cargo: usuario.cargo },
                        process.env.JWT!,
                        { expiresIn: "7d" }
                    );

                    res.status(200).json({ message: "Usuário autenticado com sucesso", authorization: token });
                } catch (error) {
                    console.error("Erro durante a autenticação:", error);
                    res.status(500).json({ message: "Erro interno no servidor" });
                }
            }

            // Transformar em um middleware
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

            if (!credential || !clientId) {
                res.status(400).send("Credenciais inválidas");
                return;
            }

            if (!authorization) {
                res.status(401).json({ message: "Token não fornecido" });
                return;
            }
        };
    };
}

export const userController = new UserController();