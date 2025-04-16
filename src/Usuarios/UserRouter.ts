import express from "express";
const router = express.Router();

import { userController } from "./UserController";

router.post("/", (req, res) => userController.userPost(req, res));

export default router;